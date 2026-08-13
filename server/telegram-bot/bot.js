import { AmuletApi, AmuletApiError } from './amuletApi.js';
import { config } from './config.js';
import { LANGUAGES, LANGUAGE_NAMES, normalizeLanguage, tr } from './i18n.js';
import { TelegramApiError, TelegramClient } from './telegramClient.js';

const PAGE_SIZE = 5;
const api = new AmuletApi(config.apiUrl, config.apiSecret);
const telegram = new TelegramClient(config.token);
const sessions = new Map();
const shutdown = new AbortController();
let offset = 0;

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const sessionFor = (chatId) => {
  const key = String(chatId);
  if (!sessions.has(key)) sessions.set(key, { language: 'en', notificationsEnabled: true });
  return sessions.get(key);
};
const isAdmin = (chatId) => config.adminChatIds.has(String(chatId));
const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.valueOf()) ? String(value).slice(0, 10) : new Intl.DateTimeFormat('en-GB').format(date);
};
const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return String(value).slice(0, 19);
  return new Intl.DateTimeFormat('hy-AM', {
    timeZone: 'Asia/Yerevan', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(date);
};
const formatMoney = (value) => `${new Intl.NumberFormat('hy-AM', { maximumFractionDigits: 0 }).format(Number(value) || 0)} ֏`;
const isPublicUrl = (value) => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol)
      && !['localhost', '127.0.0.1', '::1'].includes(url.hostname.toLowerCase())
      && !url.hostname.toLowerCase().endsWith('.local');
  } catch { return false; }
};

const send = (chatId, text, replyMarkup) => telegram.call('sendMessage', {
  chat_id: chatId,
  text,
  parse_mode: 'HTML',
  link_preview_options: { is_disabled: true },
  ...(replyMarkup ? { reply_markup: replyMarkup } : {})
});

const editOrSend = async (context, text, replyMarkup) => {
  if (context.callback?.message) {
    try {
      await telegram.call('editMessageText', {
        chat_id: context.chatId,
        message_id: context.callback.message.message_id,
        text,
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
        ...(replyMarkup ? { reply_markup: replyMarkup } : {})
      });
      return;
    } catch (error) {
      if (error instanceof TelegramApiError && /message is not modified/i.test(error.message)) return;
      throw error;
    }
  }
  await send(context.chatId, text, replyMarkup);
};

const back = (language, target = 'menu:home') => [{ text: `← ${tr(language, 'back')}`, callback_data: target }];
const mainMenu = (language, enabled = true) => ({ inline_keyboard: [
  [{ text: `💌 ${tr(language, 'invitations')}`, callback_data: 'menu:invitations' }],
  [
    { text: `🌐 ${tr(language, 'language')}`, callback_data: 'menu:language' },
    { text: `🔔 ${tr(language, enabled ? 'notifications_on' : 'notifications_off')}`, callback_data: 'notif:toggle' }
  ],
  [{ text: `ℹ️ ${tr(language, 'help')}`, callback_data: 'menu:help' }],
  [{ text: `🔌 ${tr(language, 'disconnect')}`, callback_data: 'disconnect:ask' }]
] });

const loadAccount = async (context) => {
  const account = await api.account(context.chatId);
  const session = sessionFor(context.chatId);
  session.language = normalizeLanguage(account.language, 'en');
  session.notificationsEnabled = account.notificationsEnabled !== false;
  return account;
};

const showApiError = async (context, error, markup) => {
  const language = sessionFor(context.chatId).language;
  const key = error?.status === 404 ? 'not_connected' : 'error';
  await editOrSend(context, tr(language, key), markup);
};

const showHome = async (context, welcomeKey = 'menu_title') => {
  try {
    const account = await loadAccount(context);
    const language = sessionFor(context.chatId).language;
    await editOrSend(context, tr(language, welcomeKey, {
      name: escapeHtml(account.name || context.user?.first_name || '')
    }), mainMenu(language, account.notificationsEnabled !== false));
  } catch (error) {
    await showApiError(context, error);
  }
};

const start = async (context, token) => {
  const language = normalizeLanguage(context.user?.language_code, 'en');
  sessionFor(context.chatId).language = language;
  if (!token) {
    await showHome(context, 'welcome_back');
    return;
  }

  try {
    const result = await api.connect({
      token,
      chatId: String(context.chatId),
      telegramUserId: String(context.user.id),
      username: context.user.username || '',
      firstName: context.user.first_name || '',
      languageCode: context.user.language_code || ''
    });
    sessionFor(context.chatId).language = normalizeLanguage(result.language, language);
  } catch (error) {
    // A timeout may happen after the server has already consumed the one-time
    // token. Verify the resulting account before reporting a failed link.
    if (error?.uncertain || error?.status >= 500 || error?.status === 0) {
      try {
        await loadAccount(context);
      } catch {
        console.error('Telegram account connection failed:', error.message);
        await send(context.chatId, tr(language, 'api_unavailable'));
        return;
      }
    } else {
      await send(context.chatId, tr(language, error?.status === 400 ? 'expired' : 'error'));
      return;
    }
  }
  await showHome(context, 'welcome');
};

const showInvitations = async (context) => {
  try {
    const account = await loadAccount(context);
    const language = sessionFor(context.chatId).language;
    const invitations = (account.invitations || []).filter((item) => item.id).slice(0, 40);
    if (!invitations.length) {
      await editOrSend(context, tr(language, 'no_invitations'), { inline_keyboard: [back(language)] });
      return;
    }
    await editOrSend(context, tr(language, 'invitations_title'), { inline_keyboard: [
      ...invitations.map((item) => [{
        text: `💌 ${item.title || item.templateTitle || '—'}`.slice(0, 60),
        callback_data: `inv:${item.id}`
      }]),
      back(language)
    ] });
  } catch (error) { await showApiError(context, error); }
};

const showInvitation = async (context, invitationId) => {
  const language = sessionFor(context.chatId).language;
  try {
    const data = await api.invitation(context.chatId, invitationId);
    const item = data.invitation;
    const summary = item.summary || {};
    let text = tr(language, 'invitation_details', {
      title: escapeHtml(item.title || '—'), template: escapeHtml(item.templateTitle || '—'),
      date: formatDate(item.date), time: escapeHtml(item.time || '—'),
      location: escapeHtml(item.location || '—'), replies: summary.replies || 0, guests: summary.guests || 0
    });
    if (item.url) text += `\n\n<b>${tr(language, 'invitation_url')}:</b>\n<code>${escapeHtml(item.url)}</code>`;
    const rows = [];
    if (isPublicUrl(item.url)) rows.push([{ text: `↗ ${tr(language, 'open_invitation')}`, url: item.url }]);
    if (item.ready) rows.push([{ text: `👥 ${tr(language, 'guest_replies')} (${summary.replies || 0})`, callback_data: `rsvp:${invitationId}:0` }]);
    rows.push(back(language, 'menu:invitations'));
    await editOrSend(context, text, { inline_keyboard: rows });
  } catch (error) { await showApiError(context, error, { inline_keyboard: [back(language, 'menu:invitations')] }); }
};

const showReplies = async (context, invitationId, requestedPage) => {
  const language = sessionFor(context.chatId).language;
  try {
    const data = await api.invitation(context.chatId, invitationId);
    const rsvps = data.rsvps || [];
    if (!rsvps.length) {
      await editOrSend(context, tr(language, 'no_replies'), { inline_keyboard: [back(language, `inv:${invitationId}`)] });
      return;
    }
    const pages = Math.max(1, Math.ceil(rsvps.length / PAGE_SIZE));
    const page = Math.min(Math.max(Number(requestedPage) || 0, 0), pages - 1);
    const icons = { attending: '✅', declined: '❌', unsure: '❔' };
    const items = rsvps.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE).map((item) => {
      const raw = String(item.message || '');
      const message = raw ? `\n💬 ${escapeHtml(raw.length > 280 ? `${raw.slice(0, 279)}…` : raw)}` : '';
      return tr(language, 'reply_item', {
        icon: icons[item.status] || '•', name: escapeHtml(item.guestName || '—'),
        count: tr(language, 'guests', { count: item.guestCount || 1 }),
        status: tr(language, item.status || 'unsure'), phone: escapeHtml(item.phone || '—'), message
      });
    });
    const navigation = [];
    if (page > 0) navigation.push({ text: `← ${tr(language, 'previous')}`, callback_data: `rsvp:${invitationId}:${page - 1}` });
    if (page < pages - 1) navigation.push({ text: `${tr(language, 'next')} →`, callback_data: `rsvp:${invitationId}:${page + 1}` });
    const rows = navigation.length ? [navigation] : [];
    rows.push(back(language, `inv:${invitationId}`));
    await editOrSend(context, tr(language, 'replies_title', {
      title: escapeHtml(data.invitation?.title || '—'), page: page + 1, pages, items: items.join('\n\n')
    }), { inline_keyboard: rows });
  } catch (error) { await showApiError(context, error, { inline_keyboard: [back(language, `inv:${invitationId}`)] }); }
};

const chooseLanguage = (context) => {
  const language = sessionFor(context.chatId).language;
  return editOrSend(context, tr(language, 'choose_language'), { inline_keyboard: [
    ...LANGUAGES.map((code) => [{ text: LANGUAGE_NAMES[code], callback_data: `lang:${code}` }]),
    back(language)
  ] });
};

const setLanguage = async (context, language) => {
  const normalized = normalizeLanguage(language, 'en');
  try {
    const result = await api.settings(context.chatId, { language: normalized });
    sessionFor(context.chatId).language = normalizeLanguage(result.language, normalized);
    await showHome(context);
  } catch (error) { await showApiError(context, error); }
};

const toggleNotifications = async (context) => {
  const session = sessionFor(context.chatId);
  try {
    const result = await api.settings(context.chatId, { notificationsEnabled: !session.notificationsEnabled });
    session.notificationsEnabled = result.notificationsEnabled !== false;
    await showHome(context);
  } catch (error) { await showApiError(context, error); }
};

const showHelp = async (context) => {
  try {
    await loadAccount(context);
    const language = sessionFor(context.chatId).language;
    await editOrSend(context, tr(language, 'help_text'), { inline_keyboard: [back(language)] });
  } catch (error) { await showApiError(context, error); }
};

const askDisconnect = async (context) => {
  try {
    await loadAccount(context);
    const language = sessionFor(context.chatId).language;
    await editOrSend(context, tr(language, 'disconnect_confirm'), { inline_keyboard: [
      [{ text: tr(language, 'disconnect_yes'), callback_data: 'disconnect:yes' }],
      [{ text: tr(language, 'cancel'), callback_data: 'menu:home' }]
    ] });
  } catch (error) { await showApiError(context, error); }
};

const disconnect = async (context) => {
  const language = sessionFor(context.chatId).language;
  try {
    await api.disconnect(context.chatId);
    sessions.delete(String(context.chatId));
    await editOrSend(context, tr(language, 'disconnected'));
  } catch (error) { await showApiError(context, error); }
};

const adminMenu = { inline_keyboard: [
  [{ text: '📊 Ամփոփում', callback_data: 'admin:dashboard' }],
  [{ text: '📦 Պատվերներ', callback_data: 'admin:orders:0' }, { text: '✉️ Նամակներ', callback_data: 'admin:messages:0' }],
  [{ text: '🔄 Թարմացնել', callback_data: 'admin:home' }]
] };
const adminBack = [{ text: '← Գլխավոր', callback_data: 'admin:home' }];

const showAdminHome = async (context) => {
  sessionFor(context.chatId).adminReplyMessageId = null;
  await editOrSend(context, '<b>🛡 Amulet Admin Panel</b>\n\nԸնտրեք կառավարման բաժինը։', adminMenu);
};
const showAdminDashboard = async (context) => {
  try {
    const data = await api.adminDashboard(context.chatId);
    await editOrSend(context, `<b>📊 Amulet — ամփոփում</b>\n\nՊատվերներ՝ <b>${data.orders || 0}</b>\nՎճարված՝ <b>${data.paidOrders || 0}</b>\nՉվճարված՝ <b>${data.unpaidOrders || 0}</b>\nԵկամուտ՝ <b>${formatMoney(data.revenue)}</b>\n\nԿապի նամակներ՝ <b>${data.messages || 0}</b>\nԱնպատասխան՝ <b>${data.unansweredMessages || 0}</b>`, { inline_keyboard: [adminBack] });
  } catch (error) {
    console.error('Admin dashboard could not be loaded:', error.message);
    await editOrSend(context, '<b>Տվյալները չհաջողվեց բեռնել։</b>\n\nՓորձեք կրկին։ Եթե խնդիրը շարունակվում է, ստուգեք server log-ը։', adminMenu);
  }
};
const showAdminOrders = async (context, requestedPage) => {
  try {
    const data = await api.adminOrders(context.chatId, Math.max(0, Number(requestedPage) || 0));
    const rows = (data.items || []).map((item) => [{
      text: `${item.paymentStatus === 'paid' ? '🟢' : '🟡'} ${item.customer || '—'} · ${item.invitation || '—'}`.slice(0, 60),
      callback_data: `admin:order:${item.id}`
    }]);
    const nav = [];
    if (data.page > 0) nav.push({ text: '← Նախորդ', callback_data: `admin:orders:${data.page - 1}` });
    if (data.page + 1 < data.pages) nav.push({ text: 'Հաջորդ →', callback_data: `admin:orders:${data.page + 1}` });
    if (nav.length) rows.push(nav);
    rows.push(adminBack);
    await editOrSend(context, `<b>📦 Պատվերներ (${data.total || 0})</b>\nԷջ ${(data.page || 0) + 1}/${data.pages || 1}${data.items?.length ? '' : '\n\nՊատվերներ չկան։'}`, { inline_keyboard: rows });
  } catch (error) {
    console.error('Admin orders could not be loaded:', error.message);
    await editOrSend(context, '<b>Պատվերները չհաջողվեց բեռնել։</b>', adminMenu);
  }
};
const showAdminOrder = async (context, orderId) => {
  try {
    const item = await api.adminOrder(context.chatId, orderId);
    let text = `<b>📦 Պատվերի մանրամասներ</b>\n\n<b>ID՝</b> <code>${escapeHtml(item.id)}</code>\n<b>Ստացվել է՝</b> ${formatDateTime(item.createdAt)} (Երևան)\n<b>Պատվիրատու՝</b> ${escapeHtml(item.customer || '—')}\n<b>Email՝</b> ${escapeHtml(item.email || '—')}\n<b>Հեռախոս՝</b> ${escapeHtml(item.phone || '—')}\n<b>Հրավեր՝</b> ${escapeHtml(item.invitation || '—')}\n<b>Շաբլոն՝</b> ${escapeHtml(item.template || '—')}\n<b>Գին՝</b> ${formatMoney(item.amount)}\n<b>Վճարում՝</b> ${escapeHtml(item.paymentStatus || '—')}\n<b>Միջոցառում՝</b> ${formatDate(item.eventDate)} · ${escapeHtml(item.eventTime || '—')}\n<b>Վայր՝</b> ${escapeHtml(item.eventLocation || '—')}`;
    if (item.notes) text += `\n<b>Նշումներ՝</b> ${escapeHtml(String(item.notes).slice(0, 800))}`;
    const rows = [];
    if (isPublicUrl(item.invitationUrl)) rows.push([{ text: '↗ Բացել հրավերը', url: item.invitationUrl }]);
    rows.push([{ text: '← Պատվերներ', callback_data: 'admin:orders:0' }]);
    await editOrSend(context, text, { inline_keyboard: rows });
  } catch { await editOrSend(context, '<b>Պատվերը չի գտնվել։</b>', adminMenu); }
};
const showAdminMessages = async (context, requestedPage) => {
  try {
    const data = await api.adminMessages(context.chatId, Math.max(0, Number(requestedPage) || 0));
    const rows = (data.items || []).map((item) => [{
      text: `${item.replied ? '✅' : '🔴'} ${item.name || '—'} · ${String(item.message || '').slice(0, 30)}`.slice(0, 60),
      callback_data: `admin:message:${item.id}`
    }]);
    const nav = [];
    if (data.page > 0) nav.push({ text: '← Նախորդ', callback_data: `admin:messages:${data.page - 1}` });
    if (data.page + 1 < data.pages) nav.push({ text: 'Հաջորդ →', callback_data: `admin:messages:${data.page + 1}` });
    if (nav.length) rows.push(nav);
    if (data.total > 0) rows.push([{ text: '🗑 Ջնջել բոլոր նամակները', callback_data: 'admin:delete_messages:ask' }]);
    rows.push(adminBack);
    await editOrSend(context, `<b>✉️ Կապի նամակներ (${data.total || 0})</b>\nԷջ ${(data.page || 0) + 1}/${data.pages || 1}${data.items?.length ? '' : '\n\nՆամակներ չկան։'}`, { inline_keyboard: rows });
  } catch (error) {
    console.error('Admin messages could not be loaded:', error.message);
    await editOrSend(context, '<b>Նամակները չհաջողվեց բեռնել։</b>', adminMenu);
  }
};
const showAdminMessage = async (context, messageId) => {
  try {
    const item = await api.adminMessage(context.chatId, messageId);
    let text = `<b>✉️ Կապի նամակ</b>\n\n<b>Ստացվել է՝</b> ${formatDateTime(item.createdAt)} (Երևան)\n<b>Անուն՝</b> ${escapeHtml(item.name || '—')}\n<b>Email՝</b> ${escapeHtml(item.email || '—')}\n<b>Հեռախոս՝</b> ${escapeHtml(item.phone || '—')}\n\n<b>Նամակ՝</b>\n${escapeHtml(String(item.message || '—').slice(0, 3000))}`;
    const latest = item.replies?.at(-1);
    if (latest) text += `\n\n<b>Վերջին պատասխանը (${escapeHtml(latest.channel || 'email')})՝</b>\n${escapeHtml(String(latest.message || '').slice(0, 900))}`;
    await editOrSend(context, text, { inline_keyboard: [
      [{ text: '↩️ Պատասխանել', callback_data: `admin:reply:${messageId}` }],
      [{ text: '← Նամակներ', callback_data: 'admin:messages:0' }]
    ] });
  } catch { await editOrSend(context, '<b>Նամակը չի գտնվել։</b>', adminMenu); }
};

const handleAdminCallback = async (context, data) => {
  if (!isAdmin(context.chatId)) {
    await send(context.chatId, 'Այս բաժինը հասանելի է միայն ադմիններին։');
    return;
  }
  if (data === 'admin:home') await showAdminHome(context);
  else if (data === 'admin:dashboard') await showAdminDashboard(context);
  else if (data.startsWith('admin:orders:')) await showAdminOrders(context, data.split(':').at(-1));
  else if (data.startsWith('admin:order:')) await showAdminOrder(context, data.split(':').at(-1));
  else if (data.startsWith('admin:messages:')) await showAdminMessages(context, data.split(':').at(-1));
  else if (data.startsWith('admin:message:')) await showAdminMessage(context, data.split(':').at(-1));
  else if (data.startsWith('admin:reply:')) {
    sessionFor(context.chatId).adminReplyMessageId = data.split(':').at(-1);
    await send(context.chatId, 'Գրեք պատասխանը մեկ հաղորդագրությամբ։ Չեղարկելու համար ուղարկեք /cancel։', { force_reply: true, selective: true });
  } else if (data === 'admin:delete_messages:ask') {
    await editOrSend(context, '<b>⚠️ Ջնջե՞լ բոլոր նամակները։</b>\n\nՏվյալները կհեռացվեն MongoDB-ից և չեն վերականգնվի։', { inline_keyboard: [
      [{ text: '🗑 Այո, ջնջել բոլորը', callback_data: 'admin:delete_messages:confirm' }],
      [{ text: 'Չեղարկել', callback_data: 'admin:messages:0' }]
    ] });
  } else if (data === 'admin:delete_messages:confirm') {
    const result = await api.deleteAdminMessages(context.chatId);
    await editOrSend(context, `<b>✅ Բոլոր նամակները ջնջված են։</b>\n\nՋնջվել է՝ <b>${result.deleted || 0}</b> նամակ։`, { inline_keyboard: [adminBack] });
  }
};

const handleCallback = async (context) => {
  await telegram.call('answerCallbackQuery', { callback_query_id: context.callback.id }, { attempts: 2 });
  const data = context.callback.data || '';
  if (data.startsWith('admin:')) { await handleAdminCallback(context, data); return; }
  if (data === 'menu:home') await showHome(context);
  else if (data === 'menu:invitations') await showInvitations(context);
  else if (data === 'menu:language') await chooseLanguage(context);
  else if (data === 'menu:help') await showHelp(context);
  else if (data === 'notif:toggle') await toggleNotifications(context);
  else if (data === 'disconnect:ask') await askDisconnect(context);
  else if (data === 'disconnect:yes') await disconnect(context);
  else if (data.startsWith('lang:')) await setLanguage(context, data.split(':')[1]);
  else if (data.startsWith('inv:')) await showInvitation(context, data.split(':')[1]);
  else if (data.startsWith('rsvp:')) {
    const [, invitationId, page] = data.split(':');
    await showReplies(context, invitationId, page);
  }
};

const handleAdminTextReply = async (context, message) => {
  const session = sessionFor(context.chatId);
  if (!isAdmin(context.chatId) || !session.adminReplyMessageId) return false;
  const text = String(message.text || '').trim();
  if (!text || text.startsWith('/')) return false;
  if (text.length > 4000) {
    await send(context.chatId, 'Պատասխանը պետք է լինի առավելագույնը 4000 նիշ։');
    return true;
  }
  try {
    const result = await api.replyAdminMessage(context.chatId, session.adminReplyMessageId, text);
    const messageId = session.adminReplyMessageId;
    session.adminReplyMessageId = null;
    await send(context.chatId, `✅ Պատասխանն ուղարկվեց ${result.channel === 'telegram' ? 'Telegram' : 'email'}-ով։`, { inline_keyboard: [
      [{ text: 'Բացել նամակը', callback_data: `admin:message:${messageId}` }], adminBack
    ] });
  } catch (error) { await send(context.chatId, `Պատասխանը չուղարկվեց․ ${escapeHtml(error.message)}`); }
  return true;
};

const commandFrom = (text = '') => {
  const match = String(text).match(/^\/([a-z_]+)(?:@[a-z0-9_]+)?(?:\s+(.+))?$/i);
  return match ? { name: match[1].toLowerCase(), argument: String(match[2] || '').trim() } : null;
};

const handleMessage = async (context, message) => {
  if (message.chat?.type !== 'private') return;
  const command = commandFrom(message.text);
  if (!command && await handleAdminTextReply(context, message)) return;
  if (!command) return;
  if (command.name === 'start') await start(context, command.argument.split(/\s+/)[0] || '');
  else if (command.name === 'invitations') await showInvitations(context);
  else if (command.name === 'language') {
    try { await loadAccount(context); await chooseLanguage(context); } catch (error) { await showApiError(context, error); }
  } else if (command.name === 'notifications') {
    try { await loadAccount(context); await toggleNotifications(context); } catch (error) { await showApiError(context, error); }
  } else if (command.name === 'help') await showHelp(context);
  else if (command.name === 'disconnect') await askDisconnect(context);
  else if (command.name === 'admin') {
    if (!isAdmin(context.chatId)) await send(context.chatId, 'Այս բաժինը հասանելի է միայն ադմիններին։');
    else { await installAdminCommands(context.chatId); await showAdminHome(context); }
  } else if (command.name === 'cancel' && isAdmin(context.chatId)) {
    sessionFor(context.chatId).adminReplyMessageId = null;
    await send(context.chatId, 'Պատասխանը չեղարկվեց։', adminMenu);
  }
};

const contextFrom = (update) => {
  const callback = update.callback_query;
  const message = update.message || callback?.message;
  const user = update.message?.from || callback?.from;
  return { update, callback, message, user, chatId: message?.chat?.id };
};

const handleUpdate = async (update) => {
  const context = contextFrom(update);
  if (!context.chatId || !context.user) return;
  try {
    if (context.callback) await handleCallback(context);
    else if (update.message) await handleMessage(context, update.message);
  } catch (error) {
    console.error(`Unhandled update ${update.update_id}:`, error);
    try { await send(context.chatId, tr(sessionFor(context.chatId).language, 'error')); } catch {}
  }
};

const userCommandDescriptions = {
  en: ['Open Amulet menu', 'View purchased invitations', 'Change language', 'Toggle RSVP notifications', 'How the bot works', 'Disconnect Telegram'],
  hy: ['Բացել Amulet ցանկը', 'Դիտել գնված հրավիրատոմսերը', 'Փոխել լեզուն', 'Միացնել կամ անջատել ծանուցումները', 'Ինչպես է աշխատում բոտը', 'Անջատել Telegram-ը'],
  ru: ['Открыть меню Amulet', 'Показать приглашения', 'Изменить язык', 'Изменить уведомления', 'Как работает бот', 'Отключить Telegram'],
  es: ['Abrir el menú de Amulet', 'Ver invitaciones', 'Cambiar idioma', 'Cambiar notificaciones', 'Cómo funciona el bot', 'Desconectar Telegram'],
  fr: ['Ouvrir le menu Amulet', 'Voir les invitations', 'Changer de langue', 'Changer les notifications', 'Fonctionnement du bot', 'Déconnecter Telegram'],
  de: ['Amulet-Menü öffnen', 'Einladungen anzeigen', 'Sprache ändern', 'Meldungen ändern', 'So funktioniert der Bot', 'Telegram trennen'],
  it: ['Apri il menu Amulet', 'Vedi gli inviti', 'Cambia lingua', 'Cambia notifiche', 'Come funziona il bot', 'Scollega Telegram']
};
const commandNames = ['start', 'invitations', 'language', 'notifications', 'help', 'disconnect'];
const commandsFor = (language) => commandNames.map((command, index) => ({ command, description: userCommandDescriptions[language][index] }));
const installAdminCommands = async (chatId) => {
  try {
    await telegram.call('setMyCommands', {
      commands: [
        { command: 'admin', description: 'Բացել ադմին պանելը' },
        { command: 'start', description: 'Ստուգել Amulet կապը' },
        { command: 'cancel', description: 'Չեղարկել ընթացիկ պատասխանը' }
      ],
      scope: { type: 'chat', chat_id: chatId }
    });
  } catch (error) {
    if (!/chat not found/i.test(error.message)) throw error;
    console.warn(`Admin chat ${chatId} has not started the bot yet`);
  }
};
const installCommands = async () => {
  await telegram.call('setMyCommands', { commands: commandsFor('en'), scope: { type: 'all_private_chats' } });
  for (const language of LANGUAGES) {
    await telegram.call('setMyCommands', {
      commands: commandsFor(language), scope: { type: 'all_private_chats' }, language_code: language
    });
  }
  for (const chatId of config.adminChatIds) await installAdminCommands(chatId);
};

const heartbeatLoop = async () => {
  while (!shutdown.signal.aborted) {
    let delay = 30_000;
    try {
      await api.heartbeat();
    } catch (error) {
      delay = 2_000;
      console.warn('Amulet API heartbeat failed:', error.message);
    }
    await sleep(delay);
  }
};

const pollingLoop = async () => {
  let failures = 0;
  while (!shutdown.signal.aborted) {
    try {
      const updates = await telegram.call('getUpdates', {
        offset, timeout: 50, allowed_updates: ['message', 'callback_query']
      }, { attempts: 1, timeoutMs: 60_000, signal: shutdown.signal });
      failures = 0;
      for (const update of updates) {
        offset = update.update_id + 1;
        await handleUpdate(update);
      }
    } catch (error) {
      if (shutdown.signal.aborted) break;
      failures += 1;
      console.error('Telegram polling failed:', error.message);
      await sleep(Math.min(30_000, 1000 * (2 ** Math.min(failures - 1, 5))));
    }
  }
};

const main = async () => {
  const me = await telegram.call('getMe');
  if (!me?.is_bot) throw new Error('TELEGRAM_BOT_TOKEN does not belong to a bot');
  if (config.username && me.username?.toLowerCase() !== config.username.toLowerCase()) {
    throw new Error(`TELEGRAM_BOT_USERNAME must be ${me.username}, not ${config.username}`);
  }
  if (process.argv.includes('--check')) {
    await api.heartbeat();
    console.log(`Telegram configuration is valid for @${me.username}; Amulet API is reachable`);
    return;
  }
  await telegram.call('deleteWebhook', { drop_pending_updates: false });
  await installCommands();
  await api.heartbeat().catch((error) => console.warn('Initial Amulet API heartbeat failed:', error.message));
  console.log(`Amulet Telegram bot @${me.username} is running with Node.js`);
  heartbeatLoop().catch((error) => console.error('Heartbeat loop stopped:', error));
  await pollingLoop();
};

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.once(signal, () => {
    console.log(`Received ${signal}; stopping Telegram bot`);
    shutdown.abort(new Error(signal));
  });
}

main().catch((error) => {
  console.error('Telegram bot could not start:', error);
  process.exitCode = 1;
});

export { commandFrom, escapeHtml, isPublicUrl };
