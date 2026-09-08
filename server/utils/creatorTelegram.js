import Payment from '../models/Payment.js';
import PromoCode from '../models/PromoCode.js';
import Order from '../models/Order.js';
import { clientUrl } from '../config/env.js';
import { escapeTelegramHtml, sendTelegramMessage } from './telegram.js';
import { formatYerevanDateTime } from './adminTelegram.js';
import { creatorLinkButtons, creatorDashboardButton } from './creatorPresentation.js';

export const creatorPurchaseMessage = (payment, order) => {
  const safe = (value) => escapeTelegramHtml(String(value ?? '—'));
  return [
    '<b>🛍 Նոր գնում Ձեր պրոմոկոդով</b>',
    `Պրոմոկոդ՝ <b>${safe(payment.promoCode)}</b>`,
    `Պատվերի ID՝ ${safe(order._id)}`,
    `Գնման ամսաթիվ և ժամ՝ ${safe(formatYerevanDateTime(payment.paidAt))} (Երևան)`,
    `Հրավեր՝ ${safe(order.invitationId?.names || order.mainNames)}`,
    `Շաբլոն՝ ${safe(order.templateId?.title || order.eventType)}`,
    `Տեսակ՝ ${safe(order.eventType)}`,
    `Սկզբնական գին՝ ${safe(payment.originalAmount)} ֏`,
    `Զեղչ՝ ${safe(payment.discountAmount)} ֏`,
    `Վճարված գումար՝ ${safe(payment.amount)} ֏`,
    `Ձեր տոկոսը՝ ${safe(payment.creatorCommissionPercent)}%`,
    `<b>Ձեր եկամուտը՝ ${safe(payment.creatorCommissionAmount)} ֏</b>`,
    `Նվեր՝ ${safe(payment.promoGift || '—')}`,
    payment.status === 'REFUNDED' ? 'Վճարման կարգավիճակ՝ վերադարձված (եկամտի հաշվարկից հանված)' : 'Վճարման կարգավիճակ՝ վճարված'
  ].join('\n');
};

export const notifyCreatorOfPayment = async (paymentId) => {
  const now = new Date();
  const payment = await Payment.findOneAndUpdate({
    _id: paymentId, status: 'PAID', creatorPromoId: { $ne: null }, creatorNotifiedAt: null,
    $or: [{ creatorNotificationLockAt: null }, { creatorNotificationLockAt: { $lt: new Date(Date.now() - 120000) } }]
  }, { $set: { creatorNotificationLockAt: now } }, { new: true });
  if (!payment) return;
  try {
    const [promo, order] = await Promise.all([
      PromoCode.findById(payment.creatorPromoId),
      Order.findById(payment.orderId).populate('templateId invitationId')
    ]);
    if (!promo?.creatorChatId || !order) return;
    const url = order.invitationId?.slug ? `${clientUrl()}/invite/${encodeURIComponent(order.invitationId.slug)}` : '';
    const delivered = await sendTelegramMessage(promo.creatorChatId, creatorPurchaseMessage(payment, order), {
      reply_markup: { inline_keyboard: [...creatorLinkButtons(url), creatorDashboardButton] }
    });
    if (delivered) await Payment.updateOne({ _id: payment._id }, { $set: { creatorNotifiedAt: new Date() } });
  } finally {
    await Payment.updateOne({ _id: payment._id }, { $set: {
      creatorNotificationLockAt: null, creatorNotificationRetryAt: new Date(Date.now() + 5 * 60000)
    } });
  }
};

export const startCreatorNotificationScheduler = () => {
  let running = false;
  const run = async () => {
    if (running) return;
    running = true;
    try {
      const payments = await Payment.find({ status: 'PAID', creatorPromoId: { $ne: null }, creatorNotifiedAt: null,
        $or: [{ creatorNotificationRetryAt: null }, { creatorNotificationRetryAt: { $lte: new Date() } }]
      }).sort({ creatorNotificationRetryAt: 1 }).limit(25).select('_id');
      for (const payment of payments) {
        try { await notifyCreatorOfPayment(payment._id); }
        catch (error) { console.error('Creator notification retry failed:', error.message); }
      }
    } catch (error) { console.error('Creator notifications:', error.message); }
    finally { running = false; }
  };
  void run();
  const timer = setInterval(run, 60000);
  timer.unref?.();
  return timer;
};
