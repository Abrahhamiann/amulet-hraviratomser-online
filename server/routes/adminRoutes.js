import express from 'express';
import {
  createAdminInvitation,
  createAdminReview,
  createAdminTemplate,
  createAdminUser,
  broadcastAdminEmail,
  deleteAdminInvitation,
  deleteAdminMessage,
  deleteAdminOrder,
  deleteAllAdminOrders,
  deleteAdminReview,
  deleteAdminTemplate,
  deleteAdminUser,
  getAdminAdministrators,
  getAdminCategories,
  getAdminCustomers,
  getAdminCustomer,
  getAdminDashboard,
  getAdminFaq,
  getAdminInvitations,
  getAdminLanguages,
  getAdminMessages,
  getAdminNotifications,
  getAdminOrders,
  getAdminPayments,
  getAdminReviews,
  getAdminSettings,
  getAdminTemplates,
  updateAdminInvitation,
  updateAdminFaq,
  updateAdminOrderStatus,
  updateAdminReview,
  updateAdminSettings,
  updateAdminUserRole,
  updateAdminTemplate,
  replyAdminMessage,
  sendAdminCustomerEmail
} from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/orders', getAdminOrders);
router.delete('/orders', deleteAllAdminOrders);
router.patch('/orders/:id/status', updateAdminOrderStatus);
router.delete('/orders/:id', deleteAdminOrder);
router.get('/templates', getAdminTemplates);
router.post('/templates', createAdminTemplate);
router.put('/templates/:id', updateAdminTemplate);
router.delete('/templates/:id', deleteAdminTemplate);
router.get('/invitations', getAdminInvitations);
router.post('/invitations', createAdminInvitation);
router.put('/invitations/:id', updateAdminInvitation);
router.delete('/invitations/:id', deleteAdminInvitation);
router.get('/customers', getAdminCustomers);
router.get('/customers/:id', getAdminCustomer);
router.post('/customers/:id/email', sendAdminCustomerEmail);
router.get('/payments', getAdminPayments);
router.get('/messages', getAdminMessages);
router.post('/messages/:id/reply', replyAdminMessage);
router.delete('/messages/:id', deleteAdminMessage);
router.get('/categories', getAdminCategories);
router.get('/languages', getAdminLanguages);
router.get('/administrators', getAdminAdministrators);
router.post('/users', createAdminUser);
router.patch('/users/:id/role', updateAdminUserRole);
router.delete('/users/:id', deleteAdminUser);
router.post('/broadcast', broadcastAdminEmail);
router.get('/notifications', getAdminNotifications);
router.get('/faq', getAdminFaq);
router.put('/faq', updateAdminFaq);
router.get('/reviews', getAdminReviews);
router.post('/reviews', createAdminReview);
router.put('/reviews/:id', updateAdminReview);
router.delete('/reviews/:id', deleteAdminReview);
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);

export default router;
