import User from '../models/User.js';
import { emailShell, sendMail } from './mailer.js';
import { sendTelegramMessage } from './telegram.js';

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export const deliverContactReply = async (contact, {
  subject = 'Reply from Amulet',
  message,
  adminChatId = ''
}) => {
  const cleanMessage = String(message || '').trim();
  const cleanSubject = String(subject || 'Reply from Amulet').trim().slice(0, 180);
  if (!cleanMessage) throw new Error('Reply message is required');

  const user = await User.findOne({
    email: String(contact.email || '').trim().toLowerCase(),
    'telegram.chatId': { $nin: ['', null] }
  }).select('telegram.chatId');

  let channel = 'email';
  let deliveredTo = contact.email;
  if (user?.telegram?.chatId) {
    const telegramText = [
      '💬 Amulet-ի պատասխանը Ձեր նամակին',
      '',
      cleanSubject,
      cleanMessage
    ].join('\n');
    const chunks = telegramText.match(/[\s\S]{1,3500}/g) || [];
    let telegramDelivered = true;
    for (const chunk of chunks) {
      if (!(await sendTelegramMessage(user.telegram.chatId, chunk, { parse_mode: undefined }))) {
        telegramDelivered = false;
        break;
      }
    }
    if (telegramDelivered) {
      channel = 'telegram';
      deliveredTo = String(user.telegram.chatId);
    }
  }

  if (channel === 'email') {
    await sendMail({
      to: contact.email,
      subject: cleanSubject,
      replyTo: process.env.SMTP_USER,
      html: emailShell({
        title: escapeHtml(cleanSubject),
        intro: `Hello ${escapeHtml(contact.name)}, thank you for contacting Amulet.`,
        body: escapeHtml(cleanMessage).replace(/\n/g, '<br />'),
        footer: 'Amulet team'
      }),
      text: cleanMessage
    });
  }

  contact.replies.push({
    subject: cleanSubject,
    message: cleanMessage,
    channel,
    deliveredTo,
    adminChatId: String(adminChatId || '')
  });
  contact.repliedAt = new Date();
  await contact.save();

  return { channel, deliveredTo, repliedAt: contact.repliedAt };
};
