import crypto from 'crypto';
import mongoose from 'mongoose';
import { getArcaConfig } from '../config/arca.js';
import Invitation from '../models/Invitation.js';
import InvitationDraft from '../models/InvitationDraft.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import PreviewSession from '../models/PreviewSession.js';
import PromoCode from '../models/PromoCode.js';
import Template from '../models/Template.js';
import User from '../models/User.js';
import { getOrderStatus, refundOrder, registerOrder } from './arcaService.js';
import { notifyAdminsOfOrder } from '../utils/adminTelegram.js';
import {
  arcaErrorCode,
  arcaErrorMessage,
  arcaResponseValue,
  normalizeArcaStatus
} from '../utils/arcaStatus.js';
import { optimizeInvitationDraftMedia } from '../utils/imageOptimization.js';
import {
  invitationCustomization,
  isAllowedImage,
  metadataText,
  normalizeColors,
  normalizeDraft,
  normalizeMapLinks,
  PUBLIC_DESIGN_KEYS,
  uniqueImages
} from '../utils/invitationDraft.js';
import { createSecureInvitationSlug } from '../utils/invitationSlug.js';
import { toArcaAmount } from '../utils/paymentAmount.js';
import { paymentLog, sanitizeArcaResponse } from '../utils/paymentLogger.js';
import { hashPreviewToken } from '../utils/previewToken.js';
import { normalizePromoCode, resolvePromo } from '../utils/promo.js';

const paymentError = (statusCode, code, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.publicCode = code;
  return error;
};

const localOrderId = () => `${Date.now().toString(36)}${crypto.randomBytes(9).toString('hex')}`.slice(0, 32);

const activePaymentKey = ({ userId, templateId, previewSessionId, draft, promoCode }) => crypto
  .createHash('sha256')
  .update(JSON.stringify({
    userId: String(userId),
    templateId: String(templateId),
    previewSessionId: previewSessionId ? String(previewSessionId) : '',
    draft: previewSessionId ? null : draft,
    promoCode: normalizePromoCode(promoCode)
  }))
  .digest('hex');

const ownedBy = (payment, user) => String(payment.userId?._id || payment.userId) === String(user._id);

const providerMetadata = (response) => ({
  providerStatus: String(arcaResponseValue(response, 'orderStatus') ?? ''),
  providerErrorCode: arcaErrorCode(response) || '',
  providerErrorMessage: arcaErrorMessage(response),
  sanitizedProviderResponse: sanitizeArcaResponse(response)
});

const paymentResult = async (payment) => {
  const populated = await Payment.findById(payment._id).populate({
    path: 'orderId',
    populate: [{ path: 'templateId' }, { path: 'invitationId' }]
  });
  return {
    success: true,
    paymentId: String(populated._id),
    status: populated.status,
    paymentUrl: populated.formUrl || undefined,
    url: populated.formUrl || undefined,
    order: populated.orderId || undefined
  };
};

const assertPaymentUrl = (value) => {
  try {
    const url = new URL(String(value || ''));
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol');
    if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('HTTPS required');
    return url.href;
  } catch {
    throw paymentError(502, 'PAYMENT_PROVIDER_ERROR', 'ArCa returned an invalid payment URL');
  }
};

const registerCreatedPayment = async (payment) => {
  const lockExpiry = new Date(Date.now() - 2 * 60 * 1000);
  const claimedPayment = await Payment.findOneAndUpdate({
    _id: payment._id,
    status: 'CREATED',
    $or: [{ registrationLockAt: null }, { registrationLockAt: { $lt: lockExpiry } }]
  }, { $set: { registrationLockAt: new Date() } }, { new: true });

  if (!claimedPayment) {
    const current = await Payment.findById(payment._id);
    if (current?.status === 'PENDING' && current.formUrl) return current;
    throw paymentError(409, 'PAYMENT_INITIALIZING', 'Payment is already being initialized');
  }
  payment = claimedPayment;
  const config = getArcaConfig();
  const resultPath = `/payment/success?paymentId=${encodeURIComponent(payment._id)}`;
  const returnUrl = `${config.frontendUrl}${resultPath}`;

  try {
    const response = await registerOrder({
      orderNumber: payment.localOrderId,
      amount: payment.providerAmount,
      returnUrl,
      failUrl: `${returnUrl}&returned=failed`,
      description: config.description,
      clientId: config.clientId
    });
    const arcaOrderId = String(arcaResponseValue(response, 'orderId') || '').trim();
    const formUrl = assertPaymentUrl(arcaResponseValue(response, 'formUrl'));
    if (!arcaOrderId) throw paymentError(502, 'PAYMENT_PROVIDER_ERROR', 'ArCa did not return an order identifier');

    payment.arcaOrderId = arcaOrderId;
    payment.formUrl = formUrl;
    payment.status = 'PENDING';
    payment.registrationLockAt = null;
    Object.assign(payment, providerMetadata(response));
    await payment.save();
    paymentLog('info', 'register_order', {
      paymentId: payment._id,
      localOrderId: payment.localOrderId,
      arcaOrderId
    });
    return payment;
  } catch (error) {
    const response = error.providerResponse || {};
    Object.assign(payment, providerMetadata(response));
    if (!error.retryable) {
      payment.status = 'FAILED';
      payment.failedAt = new Date();
      payment.activeKey = undefined;
    }
    payment.registrationLockAt = null;
    await payment.save().catch(() => {});
    paymentLog('error', 'register_order', {
      paymentId: payment._id,
      localOrderId: payment.localOrderId,
      httpStatus: error.httpStatus,
      providerResponse: response,
      message: error.message
    });
    throw error;
  }
};

export const createArcaPayment = async ({ user, body }) => {
  if (!mongoose.Types.ObjectId.isValid(body?.templateId)) {
    throw paymentError(400, 'INVALID_PAYMENT_REQUEST', 'Invalid template id');
  }

  const template = await Template.findById(body.templateId);
  if (!template) throw paymentError(404, 'TEMPLATE_NOT_FOUND', 'Template not found');
  if (template.deletedAt || template.isActive === false || !PUBLIC_DESIGN_KEYS.includes(template.designKey)) {
    throw paymentError(400, 'TEMPLATE_NOT_AVAILABLE', 'Template is not active');
  }

  const preview = body.previewToken
    ? await PreviewSession.findOne({
      tokenHash: hashPreviewToken(body.previewToken),
      userId: user._id,
      templateId: template._id,
      isPurchased: false,
      expiresAt: { $gt: new Date() }
    }).select('+tokenHash')
    : null;
  if (body.previewToken && !preview) {
    throw paymentError(403, 'PREVIEW_NOT_AVAILABLE', 'Preview is not available');
  }

  const draft = await optimizeInvitationDraftMedia(preview?.data || normalizeDraft(body.draft, template));
  const promoResult = body.promoCode ? await resolvePromo(body.promoCode, template.price) : null;
  if (body.promoCode && !promoResult) {
    throw paymentError(400, 'INVALID_PROMO_CODE', 'Promo code is invalid or expired');
  }

  const amount = promoResult?.finalAmount ?? Number(template.price);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw paymentError(400, 'INVALID_PAYMENT_AMOUNT', 'Payment amount must be greater than zero');
  }
  const providerAmount = toArcaAmount(amount);
  const activeKey = activePaymentKey({
    userId: user._id,
    templateId: template._id,
    previewSessionId: preview?._id,
    draft,
    promoCode: promoResult?.code
  });

  let payment = await Payment.findOne({ activeKey });
  if (payment?.status === 'PENDING' && payment.formUrl) return paymentResult(payment);
  if (payment?.status === 'CREATED') {
    payment = await registerCreatedPayment(payment);
    return paymentResult(payment);
  }

  const checkoutDraft = preview ? null : await InvitationDraft.create({
    userId: user._id,
    templateId: template._id,
    data: draft,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6)
  });

  try {
    payment = await Payment.create({
      provider: 'arca',
      status: 'CREATED',
      localOrderId: localOrderId(),
      activeKey,
      amount,
      providerAmount,
      currency: getArcaConfig().currency,
      userId: user._id,
      templateId: template._id,
      previewSessionId: preview?._id || null,
      draftId: checkoutDraft?._id || null,
      originalAmount: Number(template.price) || 0,
      discountAmount: promoResult?.discountAmount || 0,
      promoCode: promoResult?.code || '',
      promoGift: promoResult?.promo?.giftLabel || ''
    });
  } catch (error) {
    if (error?.code !== 11000) throw error;
    if (checkoutDraft) await InvitationDraft.deleteOne({ _id: checkoutDraft._id });
    payment = await Payment.findOne({ activeKey });
    if (!payment) throw error;
    if (payment.status === 'PENDING' && payment.formUrl) return paymentResult(payment);
  }

  payment = await registerCreatedPayment(payment);
  return paymentResult(payment);
};

const buildPurchasedOrder = async (payment) => {
  const [template, user, checkoutDraft, preview] = await Promise.all([
    Template.findById(payment.templateId),
    User.findById(payment.userId),
    payment.draftId ? InvitationDraft.findById(payment.draftId) : null,
    payment.previewSessionId ? PreviewSession.findById(payment.previewSessionId).select('+tokenHash') : null
  ]);
  if (!template || !user) throw paymentError(409, 'PAYMENT_CONTEXT_MISSING', 'Payment purchase context is no longer available');

  const draftData = preview?.data || checkoutDraft?.data || {};
  const fallbackDate = new Date();
  fallbackDate.setMonth(fallbackDate.getMonth() + 1);
  const rawDate = draftData.eventDate;
  const requestedDate = rawDate ? new Date(rawDate) : null;
  const eventDate = requestedDate && !Number.isNaN(requestedDate.getTime()) ? requestedDate : fallbackDate;
  const mainNames = metadataText(draftData.mainNames, template.title, 120);
  const eventTime = metadataText(draftData.eventTime, '18:00', 24);
  const eventLocation = metadataText(draftData.eventLocation, 'Yerevan, Armenia', 180);
  const eventMessage = metadataText(draftData.eventMessage, template.description, 420);
  const mapLinks = normalizeMapLinks(draftData);
  const mapLink = mapLinks[0]?.url || '';
  const colors = normalizeColors(draftData.colors);
  const colorPaletteId = metadataText(draftData.colorPaletteId, '', 80);
  const gallery = uniqueImages([
    draftData.image,
    ...(Array.isArray(draftData.gallery) ? draftData.gallery : []),
    template.mainImage,
    ...(template.gallery || [])
  ]).filter(isAllowedImage).slice(0, 8);

  let order = await Order.findOne({ paymentId: payment._id });
  if (!order) {
    order = await Order.create({
      userId: user._id,
      fullName: user.name || user.email,
      phone: 'Pending',
      email: user.email,
      eventType: template.category,
      templateId: template._id,
      eventDate,
      eventTime,
      eventLocation,
      mapLink,
      mapLinks,
      mainNames,
      eventMessage,
      colors,
      colorPaletteId,
      preferredLanguage: getArcaConfig().language,
      amount: payment.amount,
      originalAmount: payment.originalAmount,
      discountAmount: payment.discountAmount,
      promoCode: payment.promoCode,
      promoGift: payment.promoGift,
      paymentStatus: 'paid',
      paymentProvider: 'arca',
      providerPaymentId: payment.arcaOrderId,
      paymentId: payment._id,
      status: 'new'
    });
  }

  let invitation = await Invitation.findOne({ orderId: order._id });
  if (!invitation) {
    invitation = await Invitation.create({
      slug: await createSecureInvitationSlug(),
      orderId: order._id,
      templateId: template._id,
      eventType: template.category,
      names: mainNames,
      date: order.eventDate,
      time: order.eventTime,
      location: order.eventLocation,
      mapLink,
      mapLinks,
      message: eventMessage,
      gallery,
      colors,
      colorPaletteId,
      language: getArcaConfig().language,
      customization: invitationCustomization(draftData),
      isPublished: true
    });
  }

  if (!order.invitationId || String(order.invitationId) !== String(invitation._id)) {
    order.invitationId = invitation._id;
    await order.save();
  }
  if (checkoutDraft) await InvitationDraft.deleteOne({ _id: checkoutDraft._id });
  if (preview && !preview.isPurchased) {
    preview.invitationId = invitation._id;
    preview.isPurchased = true;
    preview.expiresAt = undefined;
    await preview.save();
  }
  if (payment.promoCode) {
    await PromoCode.updateOne({ code: payment.promoCode }, [{
      $set: {
        usageCount: {
          $cond: [
            { $in: [payment._id, { $ifNull: ['$redemptionPaymentIds', []] }] },
            { $ifNull: ['$usageCount', 0] },
            { $add: [{ $ifNull: ['$usageCount', 0] }, 1] }
          ]
        },
        redemptionPaymentIds: {
          $setUnion: [{ $ifNull: ['$redemptionPaymentIds', []] }, [payment._id]]
        }
      }
    }]);
  }

  await order.populate('templateId invitationId');
  return order;
};

export const finalizeSuccessfulPayment = async (paymentId, providerResponse) => {
  const lockExpiry = new Date(Date.now() - 2 * 60 * 1000);
  const payment = await Payment.findOneAndUpdate({
    _id: paymentId,
    status: 'PENDING',
    $or: [{ finalizationLockAt: null }, { finalizationLockAt: { $lt: lockExpiry } }]
  }, { $set: { finalizationLockAt: new Date() } }, { new: true });

  if (!payment) {
    const current = await Payment.findById(paymentId);
    if (current?.status === 'PAID') return current.orderId ? Order.findById(current.orderId).populate('templateId invitationId') : null;
    throw paymentError(409, 'PAYMENT_PROCESSING', 'Payment is already being finalized');
  }

  try {
    const order = await buildPurchasedOrder(payment);
    Object.assign(payment, providerMetadata(providerResponse));
    payment.status = 'PAID';
    payment.orderId = order._id;
    payment.paidAt = payment.paidAt || new Date();
    payment.finalizationLockAt = null;
    payment.activeKey = undefined;
    await payment.save();

    let notification;
    try {
      notification = await notifyAdminsOfOrder(order, { paidPurchase: true });
    } catch (error) {
      paymentLog('warn', 'purchase_notification', {
        paymentId: payment._id,
        localOrderId: payment.localOrderId,
        arcaOrderId: payment.arcaOrderId,
        message: error.message
      });
    }
    if (notification?.configured && notification.failed) {
      paymentLog('warn', 'purchase_notification', {
        paymentId: payment._id,
        localOrderId: payment.localOrderId,
        arcaOrderId: payment.arcaOrderId,
        message: `${notification.failed} Telegram admin notification(s) failed`
      });
    }
    return order;
  } catch (error) {
    await Payment.updateOne({ _id: payment._id, status: 'PENDING' }, { $set: { finalizationLockAt: null } }).catch(() => {});
    throw error;
  }
};

const failVerification = async (payment, code, message, providerResponse) => {
  payment.status = 'FAILED';
  payment.failedAt = new Date();
  payment.activeKey = undefined;
  Object.assign(payment, providerMetadata(providerResponse));
  payment.providerErrorCode = code;
  payment.providerErrorMessage = message;
  await payment.save();
  throw paymentError(409, code, message);
};

export const verifyArcaPayment = async ({ paymentId, user }) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) throw paymentError(404, 'PAYMENT_NOT_FOUND', 'Payment not found');
  if (!ownedBy(payment, user)) throw paymentError(403, 'PAYMENT_FORBIDDEN', 'This payment does not belong to the current user');
  if (['PAID', 'REFUNDED'].includes(payment.status)) return paymentResult(payment);
  if (!payment.arcaOrderId) throw paymentError(409, 'PAYMENT_NOT_REGISTERED', 'Payment has not been registered with ArCa');

  let response;
  try {
    response = await getOrderStatus({ orderId: payment.arcaOrderId });
  } catch (error) {
    Object.assign(payment, providerMetadata(error.providerResponse || {}));
    await payment.save().catch(() => {});
    paymentLog('error', 'get_order_status', {
      paymentId: payment._id,
      localOrderId: payment.localOrderId,
      arcaOrderId: payment.arcaOrderId,
      httpStatus: error.httpStatus,
      providerResponse: error.providerResponse,
      message: error.message
    });
    throw error;
  }

  const returnedOrderNumber = String(arcaResponseValue(response, 'orderNumber') || '').trim();
  if (!returnedOrderNumber || returnedOrderNumber !== payment.localOrderId) {
    return failVerification(payment, 'PAYMENT_IDENTITY_MISMATCH', 'ArCa payment identity verification failed', response);
  }

  const normalized = normalizeArcaStatus(response);
  const returnedAmount = arcaResponseValue(response, 'amount');
  const returnedCurrency = arcaResponseValue(response, 'currency');
  if (returnedAmount !== undefined && String(returnedAmount) !== payment.providerAmount) {
    return failVerification(payment, 'PAYMENT_AMOUNT_MISMATCH', 'ArCa payment amount verification failed', response);
  }
  if (returnedCurrency !== undefined && Number(returnedCurrency) !== Number(payment.currency)) {
    return failVerification(payment, 'PAYMENT_CURRENCY_MISMATCH', 'ArCa payment currency verification failed', response);
  }

  Object.assign(payment, providerMetadata(response));
  if (!normalized.recognized) {
    await payment.save();
    paymentLog('warn', 'get_order_status', {
      paymentId: payment._id,
      localOrderId: payment.localOrderId,
      arcaOrderId: payment.arcaOrderId,
      providerStatus: normalized.providerStatus,
      message: 'Unknown ArCa order status; payment remains pending'
    });
    return paymentResult(payment);
  }
  if (normalized.status === 'PAID') {
    const order = await finalizeSuccessfulPayment(payment._id, response);
    payment.orderId = order?._id;
    return paymentResult(payment);
  }
  if (normalized.status === 'REFUNDED') {
    payment.status = 'REFUNDED';
    payment.refundedAt = payment.refundedAt || new Date();
    payment.activeKey = undefined;
    await payment.save();
    if (payment.orderId) await Order.updateOne({ _id: payment.orderId }, { $set: { paymentStatus: 'refunded' } });
    return paymentResult(payment);
  }
  if (['FAILED', 'CANCELLED'].includes(normalized.status)) {
    payment.status = normalized.status;
    payment.failedAt = payment.failedAt || new Date();
    payment.activeKey = undefined;
  } else {
    payment.status = 'PENDING';
  }
  await payment.save();
  return paymentResult(payment);
};

export const refundArcaPayment = async (paymentId) => {
  const payment = await Payment.findOneAndUpdate({
    _id: paymentId,
    status: 'PAID',
    refundRequestedAt: null
  }, { $set: { refundRequestedAt: new Date() } }, { new: true });

  if (!payment) {
    const current = await Payment.findById(paymentId);
    if (!current) throw paymentError(404, 'PAYMENT_NOT_FOUND', 'Payment not found');
    if (current.status === 'REFUNDED') return paymentResult(current);
    throw paymentError(409, 'PAYMENT_NOT_REFUNDABLE', 'Payment is not in a refundable state');
  }
  if (!payment.arcaOrderId) {
    payment.refundRequestedAt = null;
    await payment.save();
    throw paymentError(409, 'PAYMENT_NOT_REFUNDABLE', 'Payment has no ArCa order identifier');
  }

  try {
    const response = await refundOrder({ orderId: payment.arcaOrderId, amount: payment.providerAmount });
    Object.assign(payment, providerMetadata(response));
    payment.status = 'REFUNDED';
    payment.refundedAt = new Date();
    payment.activeKey = undefined;
    await payment.save();
    if (payment.orderId) await Order.updateOne({ _id: payment.orderId }, { $set: { paymentStatus: 'refunded' } });
    paymentLog('info', 'refund_order', {
      paymentId: payment._id,
      localOrderId: payment.localOrderId,
      arcaOrderId: payment.arcaOrderId
    });
    return paymentResult(payment);
  } catch (error) {
    await Payment.updateOne({ _id: payment._id, status: 'PAID' }, {
      $set: {
        refundRequestedAt: null,
        providerErrorCode: error.providerCode || '',
        providerErrorMessage: arcaErrorMessage(error.providerResponse || {})
      }
    }).catch(() => {});
    paymentLog('error', 'refund_order', {
      paymentId: payment._id,
      localOrderId: payment.localOrderId,
      arcaOrderId: payment.arcaOrderId,
      httpStatus: error.httpStatus,
      providerResponse: error.providerResponse,
      message: error.message
    });
    throw error;
  }
};
