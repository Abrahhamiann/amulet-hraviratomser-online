import { escapeTelegramHtml, sendTelegramMessageToAdmins, truncateTelegramText } from './telegram.js';

const YEREVAN_TIME_ZONE = 'Asia/Yerevan';

const formatYerevanDateTime = (value = new Date()) => new Intl.DateTimeFormat('hy-AM', {
  timeZone: YEREVAN_TIME_ZONE,
  year: 'numeric',
  month: 'long',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23'
}).format(new Date(value));

const formatEventDate = (value) => {
  if (!value) return '—';
  return new Intl.DateTimeFormat('hy-AM', {
    timeZone: YEREVAN_TIME_ZONE,
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }).format(new Date(value));
};

const formatMoney = (value) => `${new Intl.NumberFormat('hy-AM').format(Number(value) || 0)} ֏`;
const safe = (value, fallback = '—') => escapeTelegramHtml(value || fallback);

export const notifyAdminsOfOrder = async (order, { paidPurchase = false } = {}) => {
  const template = order.templateId;
  const invitation = order.invitationId;
  const isCustomDesign = order.requestType === 'custom_design' || !order.templateId;
  const title = paidPurchase
    ? 'Նոր վճարված գնում'
    : isCustomDesign ? 'Անհատական դիզայնի նոր հայտ' : 'Նոր պատվերի հայտ';
  const lines = [
    `<b>🛍 ${title}</b>`,
    '',
    `<b>Ստացվել է՝</b> ${safe(formatYerevanDateTime(order.createdAt))} (Երևան)`,
    `<b>Պատվերի ID՝</b> <code>${safe(order._id)}</code>`,
    `<b>Պատվիրատու՝</b> ${safe(order.fullName)}`,
    `<b>Email՝</b> ${safe(order.email)}`,
    `<b>Հեռախոս՝</b> ${safe(order.phone)}`,
    `<b>Հրավերի անուն՝</b> ${safe(invitation?.names || order.mainNames)}`,
    `<b>Շաբլոն՝</b> ${safe(template?.title || order.eventType)}`,
    `<b>Գին՝</b> ${safe(formatMoney(Number(order.amount) || Number(template?.price) || 0))}`,
    `<b>Վճարում՝</b> ${safe(order.paymentStatus)}`,
    `<b>Միջոցառման ամսաթիվ՝</b> ${safe(formatEventDate(order.eventDate))}`,
    `<b>Միջոցառման ժամ՝</b> ${safe(order.eventTime)}`,
    `<b>Վայր՝</b> ${safe(order.eventLocation)}`,
    `<b>Լեզու՝</b> ${safe(order.preferredLanguage)}`,
  ];

  if (order.notes) lines.push(`<b>Նշումներ՝</b> ${safe(truncateTelegramText(order.notes, 700))}`);
  if (order.inspirationLink) lines.push(`<b>Ոճի օրինակ / հղում՝</b> ${safe(order.inspirationLink)}`);
  if (order.budgetRange) lines.push(`<b>Նախատեսվող բյուջե՝</b> ${safe(order.budgetRange)}`);

  return sendTelegramMessageToAdmins(lines.join('\n'), {
    reply_markup: {
      inline_keyboard: [[
        { text: '📦 Բացել պատվերը', callback_data: `admin:order:${order._id}` }
      ]]
    }
  });
};

export const notifyAdminsOfContactMessage = async (contact) => {
  const lines = [
    '<b>✉️ Նոր նամակ կայքի «Կապ» էջից</b>',
    '',
    `<b>Ստացվել է՝</b> ${safe(formatYerevanDateTime(contact.createdAt))} (Երևան)`,
    `<b>Անուն՝</b> ${safe(contact.name)}`,
    `<b>Email՝</b> ${safe(contact.email)}`,
    `<b>Հեռախոս՝</b> ${safe(contact.phone)}`,
    '',
    `<b>Նամակ՝</b>\n${safe(truncateTelegramText(contact.message, 2400))}`
  ];

  return sendTelegramMessageToAdmins(lines.join('\n'), {
    reply_markup: {
      inline_keyboard: [[
        { text: '↩️ Դիտել և պատասխանել', callback_data: `admin:message:${contact._id}` }
      ]]
    }
  });
};

export const notifyAdminsOfUnansweredContactMessage = async (contact) => {
  const minutesOpen = Math.max(15, Math.floor((Date.now() - new Date(contact.createdAt).getTime()) / 60_000));
  const lines = [
    '<b>⏰ Չպատասխանված նամակի հիշեցում</b>',
    '',
    `<b>Սպասում է՝</b> ${minutesOpen} րոպե`,
    `<b>Ստացվել է՝</b> ${safe(formatYerevanDateTime(contact.createdAt))} (Երևան)`,
    `<b>Անուն՝</b> ${safe(contact.name)}`,
    `<b>Email՝</b> ${safe(contact.email)}`,
    `<b>Հեռախոս՝</b> ${safe(contact.phone)}`,
    '',
    `<b>Նամակ՝</b>\n${safe(truncateTelegramText(contact.message, 1800))}`
  ];

  return sendTelegramMessageToAdmins(lines.join('\n'), {
    reply_markup: {
      inline_keyboard: [[
        { text: '↩️ Դիտել և պատասխանել', callback_data: `admin:message:${contact._id}` }
      ]]
    }
  });
};

export const notifyAdminsOfReview = async (review, order) => {
  const stars = '★'.repeat(Math.max(1, Math.min(5, Number(review.rating) || 5)));
  const lines = [
    '<b>⭐ Նոր հաճախորդի կարծիք</b>',
    '',
    `<b>Հաճախորդ՝</b> ${safe(review.customer)}`,
    `<b>Գնահատական՝</b> ${safe(stars)}`,
    `<b>Հրավեր՝</b> ${safe(review.target || order?.mainNames)}`,
    `<b>Պատվերի ID՝</b> <code>${safe(order?._id || review.orderId)}</code>`,
    '',
    `<b>Կարծիք՝</b>\n${safe(truncateTelegramText(review.text, 2400))}`
  ];

  return sendTelegramMessageToAdmins(lines.join('\n'));
};

export { formatYerevanDateTime };
