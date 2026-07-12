import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/ContactMessage.js';
import Invitation from '../models/Invitation.js';
import Order from '../models/Order.js';
import RSVP from '../models/RSVP.js';
import Review from '../models/Review.js';
import Setting from '../models/Setting.js';
import Template from '../models/Template.js';
import User from '../models/User.js';
import { emailShell, sendMail } from '../utils/mailer.js';
import { makeSlug } from '../utils/slug.js';

const categoryLabels = {
  wedding: 'Wedding',
  baptism: 'Baptism',
  birth: 'Birthday',
  corporate: 'Corporate',
  engagement: 'Engagement'
};

const supportedLanguages = [
  { code: 'hy', name: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' }
];

const adminRoles = ['admin', 'super_admin'];
const userRoles = ['user', ...adminRoles];

const isSuperAdmin = (user) => user?.role === 'super_admin';

const assertSuperAdmin = (req, res) => {
  if (!isSuperAdmin(req.user)) {
    res.status(403);
    throw new Error('Super administrator access required');
  }
};

const orderAmount = (order) => Number(order.templateId?.price || 0);

const paymentStatus = (status) => {
  if (status === 'completed') return 'paid';
  if (status === 'cancelled') return 'failed';
  return 'pending';
};

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const monthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

const shortMonth = (date) => date.toLocaleString('en-US', { month: 'short' });

const buildMonthlyData = (orders) => {
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
    return { key: monthKey(date), month: shortMonth(date), revenue: 0, orders: 0 };
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

const emptyMonthlyData = () => buildMonthlyData([]);

const periodStart = (period) => {
  const now = new Date();
  if (period === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === 'week') return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  if (period === 'year') return new Date(now.getFullYear(), 0, 1);
  return null;
};

const filterByPeriod = (items, period) => {
  if (period === 'zero') return [];
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
  invitation: order.mainNames,
  eventType: order.eventType,
  template: order.templateId?.title || '',
  amount: orderAmount(order),
  method: 'Manual',
  payment: paymentStatus(order.status),
  status: order.status,
  date: order.createdAt,
  eventDate: order.eventDate,
  eventTime: order.eventTime,
  eventLocation: order.eventLocation,
  mapLink: order.mapLink,
  eventMessage: order.eventMessage,
  preferredLanguage: order.preferredLanguage,
  notes: order.notes
});

const mapTemplate = (template, usage = 0) => ({
  id: String(template._id),
  name: template.title,
  slug: template.slug,
  category: categoryLabels[template.category] || template.category,
  price: template.price,
  cover: template.mainImage || template.gallery?.[0] || '',
  gallery: template.gallery || [],
  featured: template.isFeatured,
  status: 'active',
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
  payment: paymentStatus(invitation.orderId?.status),
  status: invitation.isPublished ? 'published' : 'draft',
  slug: invitation.slug,
  createdAt: invitation.createdAt
});

const buildNotifications = ({ orders, messages, invitations }) => {
  const orderItems = orders.slice(0, 4).map((order) => ({
    id: `order-${order._id}`,
    title: 'New order',
    desc: `${order.fullName} ordered ${order.mainNames}`,
    time: order.createdAt,
    read: order.status !== 'new',
    type: 'order'
  }));
  const messageItems = messages.slice(0, 4).map((message) => ({
    id: `message-${message._id}`,
    title: 'Contact message',
    desc: `${message.name}: ${message.message}`,
    time: message.createdAt,
    read: false,
    type: 'message'
  }));
  const invitationItems = invitations.slice(0, 4).map((invitation) => ({
    id: `invitation-${invitation._id}`,
    title: invitation.isPublished ? 'Invitation published' : 'Invitation draft',
    desc: invitation.names,
    time: invitation.createdAt,
    read: invitation.isPublished,
    type: 'invitation'
  }));
  return [...messageItems, ...orderItems, ...invitationItems]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10);
};

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const period = ['zero', 'today', 'week', 'year', 'all'].includes(req.query.period) ? req.query.period : 'all';
  const [templates, orders, invitations, rsvps, messages, users] = await Promise.all([
    Template.find().sort({ createdAt: -1 }),
    Order.find().populate('templateId').sort({ createdAt: -1 }),
    Invitation.find().populate('orderId templateId').sort({ createdAt: -1 }),
    RSVP.find().sort({ createdAt: -1 }),
    ContactMessage.find().sort({ createdAt: -1 }),
    User.find({ role: 'user' }).sort({ createdAt: -1 })
  ]);
  const periodOrders = filterByPeriod(orders, period);
  const periodInvitations = filterByPeriod(invitations, period);
  const periodMessages = filterByPeriod(messages, period);
  const periodRsvps = filterByPeriod(rsvps, period);
  const periodUsers = filterByPeriod(users, period);
  const visibleTemplates = period === 'zero' ? [] : templates;

  const revenue = periodOrders.reduce((sum, order) => sum + orderAmount(order), 0);
  const pendingOrders = periodOrders.filter((order) => ['new', 'in_progress'].includes(order.status)).length;
  const templateUsage = periodOrders.reduce((map, order) => {
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
      unreadMessages: periodMessages.length,
      rsvps: periodRsvps.length
    },
    period,
    revenueByMonth: period === 'zero' ? emptyMonthlyData() : buildMonthlyData(periodOrders),
    categoryDistribution: Array.from(categoryCounts, ([name, count]) => ({
      name,
      value: Math.round((count / categoryTotal) * 100)
    })),
    paymentMethodStats: [{ name: 'Manual', value: periodOrders.length }],
    latestOrders: periodOrders.slice(0, 6).map(mapOrder),
    topTemplates: visibleTemplates
      .map((template) => mapTemplate(template, templateUsage.get(String(template._id)) || 0))
      .sort((a, b) => b.usage - a.usage)
      .slice(0, 5),
    notifications: buildNotifications({ orders: periodOrders, messages: periodMessages, invitations: periodInvitations })
  });
});

export const getAdminOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('templateId').sort({ createdAt: -1 });
  res.json(orders.map(mapOrder));
});

export const getAdminTemplates = asyncHandler(async (req, res) => {
  const [templates, orders] = await Promise.all([Template.find().sort({ createdAt: -1 }), Order.find()]);
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
      phone: userOrders[0]?.phone || '',
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
    phone: orders[0]?.phone || '',
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
    method: 'Manual',
    status: paymentStatus(order.status),
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
    subject: 'Contact request',
    message: message.message,
    priority: 'normal',
    read: Boolean(message.repliedAt),
    date: message.createdAt,
    replies: message.replies || [],
    repliedAt: message.repliedAt
  })));
});

export const getAdminCategories = asyncHandler(async (req, res) => {
  const [templates, orders] = await Promise.all([Template.find(), Order.find()]);
  res.json(Object.entries(categoryLabels).map(([key, name]) => ({
    id: key,
    name,
    slug: key,
    templates: templates.filter((template) => template.category === key).length,
    orders: orders.filter((order) => order.eventType === key).length,
    status: 'active'
  })));
});

export const getAdminLanguages = asyncHandler(async (req, res) => {
  const [templates, orders] = await Promise.all([Template.countDocuments(), Order.find()]);
  res.json(supportedLanguages.map((language) => ({
    ...language,
    templates,
    orders: orders.filter((order) => order.preferredLanguage === language.code).length,
    status: 'active'
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
    lastActive: admin.updatedAt,
    permissions: admin.role === 'super_admin'
      ? ['View', 'Create', 'Edit', 'Delete', 'Publish', 'Manage payments', 'Manage admins']
      : ['View', 'Create', 'Edit', 'Delete', 'Publish']
  })));
});

export const getAdminNotifications = asyncHandler(async (req, res) => {
  const [orders, messages, invitations] = await Promise.all([
    Order.find().sort({ createdAt: -1 }).limit(10),
    ContactMessage.find().sort({ createdAt: -1 }).limit(10),
    Invitation.find().sort({ createdAt: -1 }).limit(10)
  ]);
  res.json(buildNotifications({ orders, messages, invitations }));
});

export const getAdminReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.json(reviews.map((review) => ({
    id: String(review._id),
    customer: review.customer,
    rating: review.rating,
    text: review.text,
    target: review.target,
    status: review.status,
    date: review.createdAt
  })));
});

export const getAdminSettings = asyncHandler(async (req, res) => {
  const [templates, orders, invitations, messages, users] = await Promise.all([
    Template.countDocuments(),
    Order.countDocuments(),
    Invitation.countDocuments(),
    ContactMessage.countDocuments(),
    User.countDocuments()
  ]);
  const saved = await Setting.findOne({ key: 'adminSettings' });
  res.json({
    brand: 'Amulet',
    supportEmail: process.env.SMTP_USER || '',
    supportPhone: '+374 55 710 208',
    ...(saved?.value || {}),
    totals: { templates, orders, invitations, messages, users },
    clientUrl: process.env.CLIENT_URL || ''
  });
});

export const createAdminTemplate = asyncHandler(async (req, res) => {
  const data = req.body;
  const slug = data.slug || makeSlug(data.title);
  const template = await Template.create({
    ...data,
    slug,
    features: Array.isArray(data.features) ? data.features : String(data.features || '').split('\n').filter(Boolean),
    gallery: Array.isArray(data.gallery) ? data.gallery : String(data.gallery || '').split('\n').filter(Boolean)
  });
  res.status(201).json(mapTemplate(template));
});

export const updateAdminTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }
  const data = { ...req.body };
  if (typeof data.features === 'string') data.features = data.features.split('\n').filter(Boolean);
  if (typeof data.gallery === 'string') data.gallery = data.gallery.split('\n').filter(Boolean);
  Object.assign(template, data);
  if (data.title && !data.slug) template.slug = makeSlug(data.title);
  await template.save();
  res.json(mapTemplate(template));
});

export const deleteAdminTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) {
    res.status(404);
    throw new Error('Template not found');
  }
  await template.deleteOne();
  res.json({ message: 'Template deleted' });
});

export const updateAdminOrderStatus = asyncHandler(async (req, res) => {
  const allowed = ['new', 'in_progress', 'completed', 'cancelled'];
  if (!allowed.includes(req.body.status)) {
    res.status(400);
    throw new Error('Invalid order status');
  }
  const order = await Order.findById(req.params.id).populate('templateId');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = req.body.status;
  await order.save();
  res.json(mapOrder(order));
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
      message: order.eventMessage,
      gallery: order.templateId?.gallery || [],
      language: order.preferredLanguage,
      isPublished: false,
      ...req.body
    };
  }
  payload.slug = payload.slug || makeSlug(`${payload.names}-${Date.now()}`);
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
  if (!message) {
    res.status(400);
    throw new Error('Reply message is required');
  }

  const contact = await ContactMessage.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error('Message not found');
  }

  await sendMail({
    to: contact.email,
    subject,
    replyTo: process.env.SMTP_USER,
    html: emailShell({
      title: subject,
      intro: `Hello ${contact.name}, thank you for contacting Amulet.`,
      body: String(message).replace(/\n/g, '<br />'),
      footer: 'Amulet team'
    }),
    text: message
  });

  contact.replies.push({ subject, message });
  contact.repliedAt = new Date();
  await contact.save();

  res.json({ message: 'Reply sent' });
});

export const createAdminUser = asyncHandler(async (req, res) => {
  const { name, email, password = 'Adminamulet2026', role = 'user' } = req.body;
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

export const createAdminReview = asyncHandler(async (req, res) => {
  const review = await Review.create(req.body);
  res.status(201).json(review);
});

export const updateAdminReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  Object.assign(review, req.body);
  await review.save();
  res.json(review);
});

export const deleteAdminReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  await review.deleteOne();
  res.json({ message: 'Review deleted' });
});

export const updateAdminSettings = asyncHandler(async (req, res) => {
  const setting = await Setting.findOneAndUpdate(
    { key: 'adminSettings' },
    { value: req.body },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(setting.value);
});
