import ContactMessage from '../models/ContactMessage.js';
import { notifyAdminsOfUnansweredContactMessage } from './adminTelegram.js';
import { getTelegramAdminChatIds } from './telegram.js';

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const SWEEP_INTERVAL = 60 * 1000;

let sweepInProgress = false;

export const runContactReminderSweep = async (now = new Date()) => {
  if (!getTelegramAdminChatIds().length) return { checked: 0, delivered: 0, skipped: true };
  if (sweepInProgress) return { checked: 0, delivered: 0, skipped: true };
  sweepInProgress = true;

  try {
    const reminderCutoff = new Date(now.getTime() - FIFTEEN_MINUTES);
    const messages = await ContactMessage.find({
      $and: [
        { $or: [{ repliedAt: null }, { repliedAt: { $exists: false } }] },
        { createdAt: { $lte: reminderCutoff } },
        {
          $or: [
            { lastReminderAt: null },
            { lastReminderAt: { $exists: false } },
            { lastReminderAt: { $lte: reminderCutoff } }
          ]
        }
      ]
    }).sort({ createdAt: 1 });

    let delivered = 0;
    for (const message of messages) {
      const result = await notifyAdminsOfUnansweredContactMessage(message);
      if (result.delivered > 0) {
        message.lastReminderAt = now;
        message.reminderCount = Number(message.reminderCount || 0) + 1;
        await message.save();
        delivered += 1;
      }
    }

    return { checked: messages.length, delivered, skipped: false };
  } finally {
    sweepInProgress = false;
  }
};

export const startContactReminderScheduler = () => {
  const run = () => runContactReminderSweep().catch((error) => {
    console.error('Contact-message reminder sweep failed:', error.message);
  });

  run();
  const timer = setInterval(run, SWEEP_INTERVAL);
  timer.unref?.();
  return timer;
};
