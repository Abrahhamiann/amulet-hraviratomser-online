import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Invitation from '../models/Invitation.js';
import InvitationDraft from '../models/InvitationDraft.js';
import Order from '../models/Order.js';
import Template from '../models/Template.js';

let stripeClient = null;

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  if (!stripeClient) stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeClient;
};

const metadataText = (value, fallback = '', limit = 420) => {
  const text = String(value || fallback || '').trim();
  return text.slice(0, limit);
};

const uniqueImages = (images = []) => [...new Set(
  images.filter((image) => typeof image === 'string' && image.trim())
)];

const isAllowedImage = (image) => /^(https?:\/\/|data:image\/|\/|asset:)/.test(image) && image.length < 2500000;

const normalizeDraft = (draft, template) => {
  const source = draft && typeof draft === 'object' ? draft : {};
  const sourceGallery = Array.isArray(source.gallery) ? source.gallery : [];
  const gallery = uniqueImages([source.image, ...sourceGallery])
    .filter(isAllowedImage)
    .slice(0, 8);

  return {
    mainNames: metadataText(source.mainNames, template.title, 120),
    eventDate: metadataText(source.eventDate, '', 32),
    eventTime: metadataText(source.eventTime, '18:00', 24),
    eventLocation: metadataText(source.eventLocation, 'Yerevan, Armenia', 180),
    eventMessage: metadataText(source.eventMessage, template.description, 420),
    image: metadataText(source.image, template.mainImage || template.gallery?.[0] || '', 2500000),
    gallery
  };
};

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const stripe = getStripe();

  if (!stripe) {
    res.status(500);
    throw new Error('Stripe is not configured');
  }

  const template = await Template.findById(req.body.templateId);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }
  if (template.isActive === false) {
    res.status(400);
    throw new Error('Template is not active');
  }

  const draft = normalizeDraft(req.body.draft, template);
  const checkoutDraft = await InvitationDraft.create({
    userId: req.user._id,
    templateId: template._id,
    data: draft,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 6)
  });
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'amd',
          unit_amount: Math.round(Number(template.price) * 100),
          product_data: {
            name: template.title,
            description: template.description,
            images: template.mainImage?.startsWith('http') ? [template.mainImage] : undefined
          }
        }
      }
    ],
    metadata: {
      templateId: String(template._id),
      userId: String(req.user._id),
      draftId: String(checkoutDraft._id),
      mainNames: draft.mainNames,
      eventDate: draft.eventDate,
      eventTime: draft.eventTime,
      eventLocation: draft.eventLocation,
      eventMessage: draft.eventMessage
    },
    customer_email: req.user.email,
    success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/templates/${template._id}/live?payment=cancelled`
  });

  res.json({ url: session.url });
});

const nextInviteSlug = async () => {
  let next = await Invitation.countDocuments() + 1;
  let slug = String(next);

  while (await Invitation.exists({ slug })) {
    next += 1;
    slug = String(next);
  }

  return slug;
};

export const confirmCheckoutSession = asyncHandler(async (req, res) => {
  const stripe = getStripe();

  if (!stripe) {
    res.status(500);
    throw new Error('Stripe is not configured');
  }

  const sessionId = req.body.sessionId || req.query.session_id;
  if (!sessionId) {
    res.status(400);
    throw new Error('Missing Stripe session id');
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== 'paid') {
    res.status(402);
    throw new Error('Payment is not completed');
  }

  if (session.metadata?.userId !== String(req.user._id)) {
    res.status(403);
    throw new Error('This payment does not belong to the current user');
  }

  const existing = await Order.findOne({ stripeSessionId: session.id }).populate('templateId invitationId');
  if (existing) {
    if (existing.email !== req.user.email) {
      res.status(403);
      throw new Error('This order does not belong to the current user');
    }
    res.json(existing);
    return;
  }

  const template = await Template.findById(session.metadata?.templateId);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }

  const checkoutDraft = session.metadata?.draftId
    ? await InvitationDraft.findOne({
      _id: session.metadata.draftId,
      userId: req.user._id,
      templateId: template._id
    })
    : null;
  const draftData = checkoutDraft?.data || {};

  const fallbackDate = new Date();
  fallbackDate.setMonth(fallbackDate.getMonth() + 1);

  const requestedDate = draftData.eventDate || session.metadata?.eventDate ? new Date(draftData.eventDate || session.metadata.eventDate) : null;
  const eventDate = requestedDate && !Number.isNaN(requestedDate.getTime()) ? requestedDate : fallbackDate;
  const mainNames = metadataText(draftData.mainNames || session.metadata?.mainNames, template.title, 120);
  const eventTime = metadataText(draftData.eventTime || session.metadata?.eventTime, '18:00', 24);
  const eventLocation = metadataText(draftData.eventLocation || session.metadata?.eventLocation, 'Yerevan, Armenia', 180);
  const eventMessage = metadataText(draftData.eventMessage || session.metadata?.eventMessage, template.description, 420);
  const draftGallery = Array.isArray(draftData.gallery) ? draftData.gallery : [];
  const gallery = uniqueImages([
    draftData.image,
    ...draftGallery
  ]).filter(isAllowedImage);

  const order = await Order.create({
    fullName: req.user.name || req.user.email,
    phone: 'Pending',
    email: req.user.email,
    eventType: template.category,
    templateId: template._id,
    eventDate,
    eventTime,
    eventLocation,
    mainNames,
    eventMessage,
    preferredLanguage: 'hy',
    amount: template.price,
    paymentStatus: 'paid',
    stripeSessionId: session.id,
    status: 'new'
  });

  const invitation = await Invitation.create({
    slug: await nextInviteSlug(),
    orderId: order._id,
    templateId: template._id,
    eventType: template.category,
    names: mainNames,
    date: order.eventDate,
    time: order.eventTime,
    location: order.eventLocation,
    message: eventMessage,
    gallery,
    language: 'hy',
    isPublished: true
  });

  order.invitationId = invitation._id;
  await order.save();
  if (checkoutDraft) await InvitationDraft.deleteOne({ _id: checkoutDraft._id });
  await order.populate('templateId invitationId');

  res.status(201).json(order);
});
