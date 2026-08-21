import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/ContactMessage.js';
import Invitation from '../models/Invitation.js';
import Order from '../models/Order.js';
import RSVP from '../models/RSVP.js';
import Setting from '../models/Setting.js';
import Template from '../models/Template.js';
import User from '../models/User.js';
import { emailShell, sendMail } from '../utils/mailer.js';
import { deliverContactReply } from '../utils/contactReply.js';
import { makeSlug } from '../utils/slug.js';
import { normalizePhone } from '../utils/accountValidation.js';
import { ensureTemplateCodes, nextTemplateCode, reindexTemplateCodes } from '../utils/templateCode.js';
import { PUBLIC_DESIGN_KEYS, templateCategoryForDesign } from '../utils/templateDesign.js';
import { createSecureInvitationSlug } from '../utils/invitationSlug.js';
import { translations as clientTranslations } from '../../client/src/translations/translations.js';

const categoryLabels = {
  wedding: 'Wedding',
  baptism: 'Baptism',
  birth: 'Birthday',
  corporate: 'Corporate',
  engagement: 'Engagement'
};

const adminRoles = ['admin', 'super_admin'];
const userRoles = ['user', ...adminRoles];
const DEFAULT_DESIGN_KEY = 'ivory-vows';
const FAQ_SETTING_KEY = 'faqItems';
const REVENUE_RESET_SETTING_KEY = 'revenueResetAt';
const FAQ_LANGUAGES = ['hy', 'en', 'ru'];
const FAQ_IDS = [
  'faq-price-includes', 'faq-production-time', 'faq-sharing', 'faq-languages',
  'faq-edit-after-purchase', 'faq-responsive', 'faq-rsvp', 'faq-location-map',
  'faq-replace-photos', 'faq-link-duration', 'faq-privacy', 'faq-custom-design'
];
const DEFAULT_FAQ_ITEMS = FAQ_IDS.map((id, index) => ({
  id,
  translations: Object.fromEntries(FAQ_LANGUAGES.map((language) => {
    const [question = '', answer = ''] = clientTranslations[language]?.faqItems?.[index] || [];
    return [language, { question, answer }];
  })),
  active: true
}));

const isSuperAdmin = (user) => user?.role === 'super_admin';

const assertSuperAdmin = (req, res) => {
  if (!isSuperAdmin(req.user)) {
    res.status(403);
    throw new Error('Super administrator access required');
  }
};

const orderAmount = (order) => Number(order.amount) || Number(order.templateId?.price) || 0;

const paymentStatus = (status) => {
  if (status === 'paid') return 'paid';
  if (status === 'refunded') return 'refunded';
  return 'pending';
};

const paymentMethod = (order) => order.stripeSessionId ? 'Stripe' : 'Manual';

const clampNumber = (value, min, max, fallback) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(min, number));
};

const normalizeImagePosition = (position = {}) => {
  const safePosition = position || {};
  return {
    x: clampNumber(safePosition.x, 0, 100, 50),
    y: clampNumber(safePosition.y, 0, 100, 50),
    zoom: clampNumber(safePosition.zoom, 1, 2, 1)
  };
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const shortMonth = (date) => date.toLocaleString('en-US', { month: 'short' });

const buildMonthlyData = (orders) => {
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
    return { key: monthKey(date), month: shortMonth(date), monthIndex: date.getMonth(), revenue: 0, orders: 0 };
  });
  const lookup = new Map(months.map((item) => [item.key, item]));

  orders.forEach((order) => {
    const created = new Date(order.createdAt);
    const bucket = lookup.get(monthKey(startOfMonth(created)));
    if (!bucket) return;
    bucket.orders += 1;
    bucket.revenue += orderAmount(order);
  });

  return months.map(({ key, ...item }) => item);
};

const periodStart = (period) => {
  const now = new Date();
  if (period === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === 'week') return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  if (period === 'year') return new Date(now.getFullYear(), 0, 1);
  return null;
};

const filterByPeriod = (items, period) => {
  const start = periodStart(period);
  if (!start) return items;
  return items.filter((item) => new Date(item.createdAt) >= start);
};

const mapOrder = (order) => ({
  id: String(order._id),
  _id: String(order._id),
  customer: order.fullName,
  email: order.email,
  phone: order.phone,
  requestType: order.requestType || (order.templateId ? 'standard' : 'custom_design'),
  invitation: order.mainNames,
  eventType: order.eventType,
  template: order.templateId?.title || '',
  amount: orderAmount(order),
  method: paymentMethod(order),
  payment: paymentStatus(order.paymentStatus),
  date: order.createdAt,
  eventDate: order.eventDate,
  eventTime: order.eventTime,
  eventLocation: order.eventLocation,
  mapLink: order.mapLink,
  eventMessage: order.eventMessage,
  preferredLanguage: order.preferredLanguage,
  notes: order.notes,
  inspirationLink: order.inspirationLink,
  budgetRange: order.budgetRange
});

const mapTemplate = (template, usage = 0) => ({
  id: String(template._id),
  code: template.code || '',
  name: template.title,
  slug: template.slug,
  category: template.category,
  editorType: template.editorType || template.category,
  price: template.price,
  designKey: template.designKey || DEFAULT_DESIGN_KEY,
  cover: template.mainImage || template.gallery?.[0] || '',
  pagePreviewImage: template.pagePreviewImage || '',
  imagePosition: normalizeImagePosition(template.imagePosition),
  gallery: template.gallery || [],
  galleryConfigured: Boolean(template.galleryConfigured),
  featured: template.isFeatured,
  active: template.isActive !== false,
  status: template.isActive === false ? 'inactive' : 'active',
  languages: ['HY'],
  usage,
  discount: 0,
  description: template.description,
  features: template.features || [],
  createdAt: template.createdAt
});

const mapInvitation = (invitation) => ({
  id: String(invitation._id),
  customer: invitation.orderId?.fullName || invitation.names,
  title: invitation.names,
  category: categoryLabels[invitation.eventType] || invitation.eventType,
  template: invitation.templateId?.title || 'Custom',
  language: String(invitation.language || 'hy').toUpperCase(),
  eventDate: invitation.date,
  payment: paymentStatus(invitation.orderId?.paymentStatus),
  status: invitation.isPublished ? 'published' : 'draft',
  slug: invitation.slug,
  createdAt: invitation.createdAt
});

const normalizeFaqItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .map((item, index) => {
      const localized = Object.fromEntries(FAQ_LANGUAGES.map((language) => {
        const source = item.translations?.[language] || {};
        return [language, {
          question: String(source.question || '').trim(),
          answer: String(source.answer || '').trim()
        }];
      }));
      if (item.question || item.answer) {
        localized.hy = {
          question: String(item.question || '').trim(),
          answer: String(item.answer || '').trim()
        };
      }
      return {
        id: String(item.id || `faq-${Date.now()}-${index}`),
        translations: localized,
        active: item.active !== false
      };
    })
    .filter((item) => Object.values(item.translations).some((value) => value.question && value.answer));
};

const resolveFaqItems = (saved) => {
  const savedItems = normalizeFaqItems(saved?.value?.items);
  if (saved?.value?.version === 2) return savedItems;
  if (!savedItems.length) return DEFAULT_FAQ_ITEMS;

  const savedById = new Map(savedItems.map((item) => [item.id, item]));
  const migratedDefaults = DEFAULT_FAQ_ITEMS.map((item) => {
    const savedItem = savedById.get(item.id);
    if (!savedItem) return item;
    savedById.delete(item.id);
    return {
      ...item,
      ...savedItem,
      translations: Object.fromEntries(FAQ_LANGUAGES.map((language) => [language, {
        ...item.translations[language],
        ...(savedItem.translations[language]?.question && savedItem.translations[language]?.answer
          ? savedItem.translations[language]
          : {})
      }]))
    };
  });
  return [...migratedDefaults, ...savedById.values()];
};

export const getPublicFaq = asyncHandler(async (req, res) => {
  const saved = await Setting.findOne({ key: FAQ_SETTING_KEY });
  const items = resolveFaqItems(saved);
  const language = FAQ_LANGUAGES.includes(req.query.language) ? req.query.language : 'hy';
  res.json({ items: items.filter((item) => item.active).map((item) => {
    const localized = item.translations[language];
    const fallback = item.translations.hy || item.translations.en || Object.values(item.translations).find((value) => value.question && value.answer);
    return { id: item.id, active: item.active, ...(localized?.question && localized?.answer ? localized : fallback) };
  }) });
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const period = ['today', 'week', 'year', 'all'].includes(req.query.period) ? req.query.period : 'all';
  const [templates, orders, invitations, rsvps, messages, users, revenueResetSetting] = await Promise.all([
    Template.find({ designKey: { $in: PUBLIC_DESIGN_KEYS } }).sort({ createdAt: -1 }),
    Order.find().populate('templateId').sort({ createdAt: -1 }),
    Invitation.find().populate('orderId templateId').sort({ createdAt: -1 }),
    RSVP.find().sort({ createdAt: -1 }),
    ContactMessage.find().sort({ createdAt: -1 }),
    User.find({ role: 'user' }).sort({ createdAt: -1 }),
    Setting.findOne({ key: REVENUE_RESET_SETTING_KEY })
  ]);
  const revenueResetAt = revenueResetSetting?.value?.at ? new Date(revenueResetSetting.value.at) : null;
  const ordersAfterRevenueReset = revenueResetAt && !Number.isNaN(revenueResetAt.getTime())
    ? orders.filter((order) => new Date(order.createdAt) > revenueResetAt)
    : orders;
  const periodAllOrders = filterByPeriod(orders, period);
  const periodOrders = filterByPeriod(ordersAfterRevenueReset, period);
  const periodInvitations = filterByPeriod(invitations, period);
  const periodMessages = filterByPeriod(messages, period);
  const periodRsvps = filterByPeriod(rsvps, period);
  const periodUsers = filterByPeriod(users, period);
  const visibleTemplates = templates;

  const paidPeriodOrders = periodOrders.filter((order) => order.paymentStatus === 'paid');
  const revenue = paidPeriodOrders.reduce((sum, order) => sum + orderAmount(order), 0);
  const pendingOrders = periodAllOrders.filter((order) => order.paymentStatus !== 'paid').length;
  const templateUsage = periodAllOrders.reduce((map, order) => {
    const id = order.templateId?._id ? String(order.templateId._id) : null;
    if (id) map.set(id, (map.get(id) || 0) + 1);
    return map;
  }, new Map());

  const categoryCounts = visibleTemplates.reduce((map, template) => {
    const label = categoryLabels[template.category] || template.category;
    map.set(label, (map.get(label) || 0) + 1);
    return map;
  }, new Map());
  const categoryTotal = Math.max(visibleTemplates.length, 1);

  res.json({
    stats: {
      revenue,
      orders: periodOrders.length,
      invitations: periodInvitations.length,
      customers: periodUsers.length,
      pendingOrders,
      unreadMessages: periodMessages.filter((message) => !message.repliedAt).length,
      rsvps: periodRsvps.length
    },
    period,
    revenueResetAt,
    revenueByMonth: buildMonthlyData(paidPeriodOrders),
    categoryDistribution: Array.from(categoryCounts, ([name, count]) => ({
      name,
      value: Math.round((count / categoryTotal) * 100)
    })),
    paymentMethodStats: ['Stripe', 'Manual'].map((name) => ({
      name,
      value: periodOrders.filter((order) => paymentMethod(order) === name).length
    })).filter((item) => item.value > 0),
    latestOrders: periodAllOrders.slice(0, 6).map(mapOrder),
    topTemplates: visibleTemplates
      .map((template) => mapTemplate(template, templateUsage.get(String(template._id)) || 0))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5)
  });
});

export const resetAdminRevenue = asyncHandler(async (req, res) => {
  const at = new Date();
  await Setting.findOneAndUpdate(
    { key: REVENUE_RESET_SETTING_KEY },
    { value: { at, resetBy: String(req.user._id) } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json({ success: true, resetAt: at });
});

export const getAdminOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('templateId').sort({ createdAt: -1 });
  res.json(orders.map(mapOrder));
});

export const getAdminTemplates = asyncHandler(async (req, res) => {
  await ensureTemplateCodes();
  const [templates, orders] = await Promise.all([
    Template.find({ designKey: { $in: PUBLIC_DESIGN_KEYS } }).sort({ createdAt: -1 }),
    Order.find()
  ]);
  const usage = orders.reduce((map, order) => {
    const id = order.templateId ? String(order.templateId) : null;
    if (id) map.set(id, (map.get(id) || 0) + 1);
    return map;
  }, new Map());
  res.json(templates.map((template) => mapTemplate(template, usage.get(String(template._id)) || 0)));
});

export const getAdminInvitations = asyncHandler(async (req, res) => {
  const invitations = await Invitation.find().populate('orderId templateId').sort({ createdAt: -1 });
  res.json(invitations.map(mapInvitation));
});

export const getAdminCustomers = asyncHandler(async (req, res) => {
  const [users, orders] = await Promise.all([
    User.find({ role: 'user' }).sort({ createdAt: -1 }),
    Order.find().populate('templateId')
  ]);

  res.json(users.map((user) => {
    const userOrders = orders.filter((order) => order.email === user.email);
    const spent = userOrders.reduce((sum, order) => sum + orderAmount(order), 0);
    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      provider: user.provider,
      googleId: user.googleId,
      phone: user.phone || userOrders[0]?.phone || '',
      joined: user.createdAt,
      orders: userOrders.length,
      spent,
      status: user.isEmailVerified ? 'active' : 'pending',
      lastActive: userOrders[0]?.createdAt || user.updatedAt
    };
  }));
});

export const getAdminCustomer = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user || user.role !== 'user') {
    res.status(404);
    throw new Error('Customer not found');
  }

  const orders = await Order.find({ email: user.email }).populate('templateId').sort({ createdAt: -1 });
  const invitations = await Invitation.find({ orderId: { $in: orders.map((order) => order._id) } })
    .populate('orderId templateId')
    .sort({ createdAt: -1 });

  res.json({
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    provider: user.provider,
    isEmailVerified: user.isEmailVerified,
    joined: user.createdAt,
    lastActive: user.updatedAt,
    phone: user.phone || orders[0]?.phone || '',
    orders: orders.map(mapOrder),
    invitations: invitations.map(mapInvitation),
    spent: orders.reduce((sum, order) => sum + orderAmount(order), 0)
  });
});

export const getAdminPayments = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('templateId').sort({ createdAt: -1 });
  res.json(orders.map((order) => ({
    txId: `PAY-${String(order._id).slice(-8).toUpperCase()}`,
    customer: order.fullName,
    order: String(order._id),
    amount: orderAmount(order),
    method: paymentMethod(order),
    status: paymentStatus(order.paymentStatus),
    date: order.createdAt
  })));
});

export const getAdminMessages = asyncHandler(async (req, res) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  res.json(messages.map((message) => ({
    id: String(message._id),
    name: message.name,
    email: message.email,
    phone: message.phone,
    message: message.message,
    read: Boolean(message.repliedAt),
    date: message.createdAt,
    replies: message.replies || [],
    repliedAt: message.repliedAt
  })));
});

export const getAdminAdministrators = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: { $in: adminRoles } }).sort({ createdAt: -1 });
  res.json(admins.map((admin) => ({
    id: String(admin._id),
    name: admin.name,
    email: admin.email,
    role: admin.role,
    status: admin.isEmailVerified ? 'active' : 'pending',
    joined: admin.createdAt,
    lastActive: admin.updatedAt
  })));
});

export const getAdminFaq = asyncHandler(async (req, res) => {
  const saved = await Setting.findOne({ key: FAQ_SETTING_KEY });
  res.json({ items: resolveFaqItems(saved) });
});

export const updateAdminFaq = asyncHandler(async (req, res) => {
  const items = normalizeFaqItems(req.body?.items);
  const setting = await Setting.findOneAndUpdate(
    { key: FAQ_SETTING_KEY },
    { value: { items, initialized: true, version: 2 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json({ items: normalizeFaqItems(setting.value?.items) });
});

export const createAdminTemplate = asyncHandler(async (req, res) => {
  const data = req.body;
  const slug = data.slug || makeSlug(data.title);
  const designKey = PUBLIC_DESIGN_KEYS.includes(data.designKey) ? data.designKey : DEFAULT_DESIGN_KEY;
  const category = templateCategoryForDesign(designKey) || data.category;
  const template = await Template.create({
    ...data,
    category,
    code: await nextTemplateCode(category),
    slug,
    features: Array.isArray(data.features) ? data.features : String(data.features || '').split('\n').filter(Boolean),
    gallery: Array.isArray(data.gallery) ? data.gallery : String(data.gallery || '').split('\n').filter(Boolean),
    galleryConfigured: Boolean(data.galleryConfigured),
    imagePosition: normalizeImagePosition(data.imagePosition),
    designKey,
    editorType: category,
    isActive: data.isActive !== false
  });
  res.status(201).json(mapTemplate(template));
});

export const updateAdminTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }
  const previousCategory = template.category;
  const { code: _ignoredCode, ...data } = req.body;
  data.designKey = PUBLIC_DESIGN_KEYS.includes(data.designKey) ? data.designKey : template.designKey;
  data.category = templateCategoryForDesign(data.designKey) || data.category || template.category;
  data.editorType = data.category;
  if (data.category !== template.category) data.code = await nextTemplateCode(data.category);
  if (typeof data.features === 'string') data.features = data.features.split('\n').filter(Boolean);
  if (typeof data.gallery === 'string') data.gallery = data.gallery.split('\n').filter(Boolean);
  data.galleryConfigured = Boolean(data.galleryConfigured);
  data.imagePosition = normalizeImagePosition(data.imagePosition);
  Object.assign(template, data);
  if (data.title && !data.slug) template.slug = makeSlug(data.title);
  await template.save();
  if (previousCategory !== template.category) await reindexTemplateCodes(previousCategory);
  res.json(mapTemplate(template));
});

export const deleteAdminTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }
  const category = template.category;
  await template.deleteOne();
  await reindexTemplateCodes(category);
  res.json({ message: 'Template deleted' });
});

export const deleteAdminOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  await Invitation.deleteMany({ orderId: order._id });
  await order.deleteOne();
  res.json({ message: 'Order deleted' });
});

export const deleteAllAdminOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().select('_id');
  const ids = orders.map((order) => order._id);
  const invitations = await Invitation.deleteMany({ orderId: { $in: ids } });
  const result = await Order.deleteMany({});
  res.json({ deleted: result.deletedCount || 0, invitationsDeleted: invitations.deletedCount || 0 });
});

export const createAdminInvitation = asyncHandler(async (req, res) => {
  let payload = { ...req.body };
  if (payload.orderId) {
    const order = await Order.findById(payload.orderId).populate('templateId');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    payload = {
      orderId: order._id,
      templateId: order.templateId?._id,
      eventType: order.eventType,
      names: order.mainNames,
      date: order.eventDate,
      time: order.eventTime,
      location: order.eventLocation,
      mapLink: order.mapLink,
      mapLinks: order.mapLinks || [],
      message: order.eventMessage,
      gallery: order.templateId?.gallery || [],
      colors: order.colors,
      language: order.preferredLanguage,
      isPublished: false,
      ...req.body
    };
  }
  payload.slug = await createSecureInvitationSlug();
  const invitation = await Invitation.create(payload);
  await invitation.populate('orderId templateId');
  res.status(201).json(mapInvitation(invitation));
});

export const updateAdminInvitation = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) {
    res.status(404);
    throw new Error('Invitation not found');
  }
  Object.assign(invitation, req.body);
  if (!invitation.slug) invitation.slug = makeSlug(`${invitation.names}-${Date.now()}`);
  await invitation.save();
  await invitation.populate('orderId templateId');
  res.json(mapInvitation(invitation));
});

export const deleteAdminInvitation = asyncHandler(async (req, res) => {
  const invitation = await Invitation.findById(req.params.id);
  if (!invitation) {
    res.status(404);
    throw new Error('Invitation not found');
  }
  await invitation.deleteOne();
  res.json({ message: 'Invitation deleted' });
});

export const deleteAdminMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }
  await message.deleteOne();
  res.json({ message: 'Message deleted' });
});

export const replyAdminMessage = asyncHandler(async (req, res) => {
  const { subject = 'Reply from Amulet', message } = req.body;
  if (!String(message || '').trim()) {
    res.status(400);
    throw new Error('Reply message is required');
  }

  const contact = await ContactMessage.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Message not found');
  }

  const delivery = await deliverContactReply(contact, { subject, message });
  res.json({ message: 'Reply sent', ...delivery });
});

export const createAdminUser = asyncHandler(async (req, res) => {
  const { name, email, phone, password = 'Adminamulet2026!', role = 'user' } = req.body;
  if (!name || !email) {
    res.status(400);
    throw new Error('Name and email are required');
  }
  if (!userRoles.includes(role)) {
    res.status(400);
    throw new Error('Invalid user role');
  }
  if (adminRoles.includes(role)) {
    assertSuperAdmin(req, res);
  }
  const existing = await User.findOne({ email: email.trim().toLowerCase() });
  if (existing) {
    res.status(409);
    throw new Error('User already exists');
  }
  const user = await User.create({
    name,
    email,
    ...(normalizePhone(phone) ? { phone: normalizePhone(phone) } : {}),
    password,
    role,
    provider: 'local',
    isEmailVerified: true
  });
  res.status(201).json({
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    status: 'active'
  });
});

export const deleteAdminUser = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  if (adminRoles.includes(user.role)) {
    assertSuperAdmin(req, res);
  }
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

export const updateAdminUserRole = asyncHandler(async (req, res) => {
  assertSuperAdmin(req, res);
  const { role } = req.body;
  if (!userRoles.includes(role)) {
    res.status(400);
    throw new Error('Invalid user role');
  }
  if (String(req.user._id) === req.params.id && role !== 'super_admin') {
    res.status(400);
    throw new Error('You cannot remove your own super administrator role');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  user.role = role;
  if (adminRoles.includes(role)) user.isEmailVerified = true;
  await user.save();
  res.json({
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.isEmailVerified ? 'active' : 'pending',
    lastActive: user.updatedAt
  });
});

export const sendAdminCustomerEmail = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    res.status(400);
    throw new Error('Subject and message are required');
  }
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await sendMail({
    to: user.email,
    subject,
    html: emailShell({
      title: subject,
      intro: `Hello ${user.name},`,
      body: String(message).replace(/\n/g, '<br />'),
      footer: 'Amulet team'
    }),
    text: message
  });

  res.json({ message: 'Email sent' });
});

export const broadcastAdminEmail = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    res.status(400);
    throw new Error('Subject and message are required');
  }

  const users = await User.find({ role: 'user', isEmailVerified: true });
  await Promise.all(users.map((user) => sendMail({
    to: user.email,
    subject,
    html: emailShell({
      title: subject,
      intro: `Hello ${user.name},`,
      body: String(message).replace(/\n/g, '<br />'),
      footer: 'Amulet team'
    }),
    text: message
  })));

  res.json({ sent: users.length });
});
