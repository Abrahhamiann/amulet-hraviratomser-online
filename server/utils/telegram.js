import Order from '../models/Order.js';
import User from '../models/User.js';

export const TELEGRAM_LANGUAGES = ['hy', 'en', 'ru', 'es', 'fr', 'de', 'it'];

export const normalizeTelegramLanguage = (language, fallback = 'hy') => (
  TELEGRAM_LANGUAGES.includes(language) ? language : fallback
);

const resolveTelegramBotToken = () => (
  process.env.TELEGRAM_SHARED_BOT_TOKEN
  || process.env.TELEGRAM_BOT_TOKEN
  || ''
).trim();

const ADMIN_ID_ENV_KEYS = [
  'TELEGRAM_ADMIN_CHAT_IDS',
  'TELEGRAM_ADMIN_1_ID',
  'TELEGRAM_ADMIN_2_ID'
];

export const getTelegramAdminChatIds = () => [...new Set(
  ADMIN_ID_ENV_KEYS
    .flatMap((key) => String(process.env[key] || '').split(/[\s,;]+/))
    .map((value) => value.trim())
    .filter((value) => /^-?\d+$/.test(value))
)];

export const isTelegramAdmin = (chatId) => (
  getTelegramAdminChatIds().includes(String(chatId || '').trim())
);

let healthCache = { checkedAt: 0, available: false };

export const getTelegramBotHealth = async () => {
  const botToken = resolveTelegramBotToken();
  if (!botToken) return false;
  if (Date.now() - healthCache.checkedAt < 60_000) return healthCache.available;

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`, {
      signal: AbortSignal.timeout(5000)
    });
    const payload = response.ok ? await response.json() : null;
    healthCache = {
      checkedAt: Date.now(),
      available: Boolean(payload?.ok && payload?.result?.is_bot)
    };
  } catch {
    healthCache = { checkedAt: Date.now(), available: false };
  }
  return healthCache.available;
};

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const truncate = (value = '', maxLength = 600) => {
  const text = String(value);
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
};

const isPublicWebUrl = (value) => {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return (
      ['http:', 'https:'].includes(url.protocol)
      && hostname
      && !['localhost', '127.0.0.1', '::1'].includes(hostname)
      && !hostname.endsWith('.local')
    );
  } catch {
    return false;
  }
};

const labels = {
  hy: {
    title: 'Նոր հյուրի պատասխան',
    invitation: 'Հրավեր',
    guest: 'Հյուր',
    status: 'Մասնակցություն',
    count: 'Հյուրերի քանակ',
    phone: 'Հեռախոս',
    message: 'Նամակ',
    attending: 'Կգա',
    declined: 'Չի գա',
    unsure: 'Դեռ վստահ չէ',
    open: 'Բացել հյուրերի պատասխանները'
  },
  en: {
    title: 'New guest reply',
    invitation: 'Invitation',
    guest: 'Guest',
    status: 'Attendance',
    count: 'Number of guests',
    phone: 'Phone',
    message: 'Message',
    attending: 'Attending',
    declined: 'Not attending',
    unsure: 'Not sure yet',
    open: 'Open guest replies'
  },
  ru: {
    title: 'Новый ответ гостя',
    invitation: 'Приглашение',
    guest: 'Гость',
    status: 'Участие',
    count: 'Количество гостей',
    phone: 'Телефон',
    message: 'Сообщение',
    attending: 'Будет',
    declined: 'Не будет',
    unsure: 'Пока не уверен(а)',
    open: 'Открыть ответы гостей'
  },
  es: {
    title: 'Nueva respuesta de invitado',
    invitation: 'Invitación',
    guest: 'Invitado',
    status: 'Asistencia',
    count: 'Número de invitados',
    phone: 'Teléfono',
    message: 'Mensaje',
    attending: 'Asistirá',
    declined: 'No asistirá',
    unsure: 'Aún no está seguro',
    open: 'Abrir respuestas'
  },
  fr: {
    title: 'Nouvelle réponse d’un invité',
    invitation: 'Invitation',
    guest: 'Invité',
    status: 'Présence',
    count: 'Nombre d’invités',
    phone: 'Téléphone',
    message: 'Message',
    attending: 'Présent',
    declined: 'Absent',
    unsure: 'Pas encore sûr',
    open: 'Ouvrir les réponses'
  },
  de: {
    title: 'Neue Gästeantwort',
    invitation: 'Einladung',
    guest: 'Gast',
    status: 'Teilnahme',
    count: 'Anzahl der Gäste',
    phone: 'Telefon',
    message: 'Nachricht',
    attending: 'Nimmt teil',
    declined: 'Nimmt nicht teil',
    unsure: 'Noch unsicher',
    open: 'Gästeantworten öffnen'
  },
  it: {
    title: 'Nuova risposta di un ospite',
    invitation: 'Invito',
    guest: 'Ospite',
    status: 'Partecipazione',
    count: 'Numero di ospiti',
    phone: 'Telefono',
    message: 'Messaggio',
    attending: 'Parteciperà',
    declined: 'Non parteciperà',
    unsure: 'Non è ancora sicuro',
    open: 'Apri le risposte'
  }
};

export const sendTelegramMessage = async (chatId, text, options = {}) => {
  const botToken = resolveTelegramBotToken();
  if (!botToken || !chatId) return false;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
          ...options
        }),
        signal: AbortSignal.timeout(8000)
      });
      if (response.ok) return true;
      const payload = await response.json().catch(() => null);
      if (attempt === 2) {
        console.error(
          'Telegram notification was rejected:',
          payload?.description || `HTTP ${response.status}`
        );
      }
    } catch (error) {
      if (attempt === 2) {
        console.error('Telegram notification could not be delivered:', error.message);
      }
    }
    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 750 * (2 ** attempt)));
    }
  }
  return false;
};

export const sendTelegramMessageToAdmins = async (text, options = {}) => {
  const adminChatIds = getTelegramAdminChatIds();
  if (!adminChatIds.length) {
    console.warn('Telegram admin notifications are disabled: no admin chat IDs are configured');
    return { configured: false, delivered: 0, failed: 0 };
  }

  const results = await Promise.all(
    adminChatIds.map((chatId) => sendTelegramMessage(chatId, text, options))
  );
  return {
    configured: true,
    delivered: results.filter(Boolean).length,
    failed: results.filter((result) => !result).length
  };
};

export const escapeTelegramHtml = escapeHtml;
export const truncateTelegramText = truncate;

export const notifyInvitationOwnerOfRsvp = async (invitation, rsvp) => {
  let order = invitation.orderId
    ? await Order.findById(invitation.orderId).select('email mainNames preferredLanguage')
    : null;
  if (!order) {
    order = await Order.findOne({ invitationId: invitation._id })
      .select('email mainNames preferredLanguage');
  }
  if (!order?.email) return false;

  const user = await User.findOne({
    email: order.email.toLowerCase(),
    'telegram.chatId': { $ne: '' },
    'telegram.notificationsEnabled': { $ne: false }
  });
  if (!user?.telegram?.chatId) return false;

  const language = normalizeTelegramLanguage(
    user.telegram.language,
    normalizeTelegramLanguage(order.preferredLanguage)
  );
  const copy = labels[language];
  const status = copy[rsvp.status] || rsvp.status;
  const clientUrl = (process.env.CLIENT_URL || 'http://localhost:5173').replace(/\/$/, '');
  const detailsUrl = `${clientUrl}/account/invitations/${invitation._id}/responses`;
  const lines = [
    `<b>🔔 ${copy.title}</b>`,
    '',
    `<b>${copy.invitation}:</b> ${escapeHtml(invitation.names || order.mainNames)}`,
    `<b>${copy.guest}:</b> ${escapeHtml(rsvp.guestName)}`,
    `<b>${copy.status}:</b> ${escapeHtml(status)}`,
    `<b>${copy.count}:</b> ${Number(rsvp.guestCount) || 1}`,
    `<b>${copy.phone}:</b> ${escapeHtml(rsvp.phone)}`
  ];

  if (rsvp.message) lines.push(`<b>${copy.message}:</b> ${escapeHtml(truncate(rsvp.message))}`);

  const messageOptions = isPublicWebUrl(detailsUrl)
    ? {
        reply_markup: {
          inline_keyboard: [[{ text: copy.open, url: detailsUrl }]]
        }
      }
    : {};

  return sendTelegramMessage(user.telegram.chatId, lines.join('\n'), messageOptions);
};
