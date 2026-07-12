import express from 'express';
import {
  createAdminInvitation,
  createAdminReview,
  createAdminTemplate,
  createAdminUser,
  deleteAdminInvitation,
  deleteAdminMessage,
  deleteAdminReview,
  deleteAdminTemplate,
  deleteAdminUser,
  getAdminAdministrators,
  getAdminCategories,
  getAdminCustomers,
  getAdminDashboard,
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
  updateAdminOrderStatus,
  updateAdminReview,
  updateAdminSettings,
  updateAdminTemplate
} from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', updateAdminOrderStatus);
router.get('/templates', getAdminTemplates);
router.post('/templates', createAdminTemplate);
router.put('/templates/:id', updateAdminTemplate);
router.delete('/templates/:id', deleteAdminTemplate);
router.get('/invitations', getAdminInvitations);
router.post('/invitations', createAdminInvitation);
router.put('/invitations/:id', updateAdminInvitation);
router.delete('/invitations/:id', deleteAdminInvitation);
router.get('/customers', getAdminCustomers);
router.get('/payments', getAdminPayments);
router.get('/messages', getAdminMessages);
router.delete('/messages/:id', deleteAdminMessage);
router.get('/categories', getAdminCategories);
router.get('/languages', getAdminLanguages);
router.get('/administrators', getAdminAdministrators);
router.post('/users', createAdminUser);
router.delete('/users/:id', deleteAdminUser);
router.get('/notifications', getAdminNotifications);
router.get('/reviews', getAdminReviews);
router.post('/reviews', createAdminReview);
router.put('/reviews/:id', updateAdminReview);
router.delete('/reviews/:id', deleteAdminReview);
router.get('/settings', getAdminSettings);
router.put('/settings', updateAdminSettings);

export default router;
