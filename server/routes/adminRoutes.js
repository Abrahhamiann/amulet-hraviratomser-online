import express from 'express';
import {
  createAdminInvitation,
  createAdminTemplate,
  createAdminUser,
  broadcastAdminEmail,
  deleteAdminInvitation,
  deleteAdminMessage,
  deleteAdminOrder,
  deleteAllAdminOrders,
  deleteAdminTemplate,
  deleteAdminUser,
  getAdminAdministrators,
  getAdminCustomers,
  getAdminCustomer,
  getAdminDashboard,
  getAdminFaq,
  getAdminInvitations,
  getAdminMessages,
  getAdminOrders,
  getAdminPayments,
  getAdminTemplate,
  getAdminTemplates,
  updateAdminInvitation,
  updateAdminFaq,
  updateAdminUserRole,
  updateAdminTemplate,
  replyAdminMessage,
  resetAdminRevenue,
  restoreAdminTemplate,
  sendAdminCustomerEmail
} from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';
import {
  createAdminPromoCode,
  deleteAdminPromoCode,
  getAdminPromoCodes,
  updateAdminPromoCode
} from '../controllers/promoController.js';
import {
  createAdminReview,
  deleteAdminReview,
  getAdminReviews,
  updateAdminReview
} from '../controllers/adminReviewController.js';
import { refundPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getAdminDashboard);
router.post('/dashboard/reset-revenue', resetAdminRevenue);
router.get('/orders', getAdminOrders);
router.delete('/orders', deleteAllAdminOrders);
router.delete('/orders/:id', deleteAdminOrder);
router.get('/templates', getAdminTemplates);
router.get('/templates/:id', validateObjectId(), getAdminTemplate);
router.post('/templates', createAdminTemplate);
router.put('/templates/:id', updateAdminTemplate);
router.delete('/templates/:id', deleteAdminTemplate);
router.post('/templates/:id/restore', restoreAdminTemplate);
router.get('/invitations', getAdminInvitations);
router.post('/invitations', createAdminInvitation);
router.put('/invitations/:id', updateAdminInvitation);
router.delete('/invitations/:id', deleteAdminInvitation);
router.get('/customers', getAdminCustomers);
router.get('/customers/:id', getAdminCustomer);
router.post('/customers/:id/email', sendAdminCustomerEmail);
router.get('/payments', getAdminPayments);
router.post('/payments/:paymentId/refund', validateObjectId('paymentId'), refundPayment);
router.get('/messages', getAdminMessages);
router.post('/messages/:id/reply', replyAdminMessage);
router.delete('/messages/:id', deleteAdminMessage);
router.get('/administrators', getAdminAdministrators);
router.post('/users', createAdminUser);
router.patch('/users/:id/role', updateAdminUserRole);
router.delete('/users/:id', deleteAdminUser);
router.post('/broadcast', broadcastAdminEmail);
router.get('/faq', getAdminFaq);
router.put('/faq', updateAdminFaq);
router.get('/promocodes', getAdminPromoCodes);
router.post('/promocodes', createAdminPromoCode);
router.put('/promocodes/:id', validateObjectId(), updateAdminPromoCode);
router.delete('/promocodes/:id', validateObjectId(), deleteAdminPromoCode);
router.get('/reviews', getAdminReviews);
router.post('/reviews', createAdminReview);
router.put('/reviews/:id', validateObjectId(), updateAdminReview);
router.delete('/reviews/:id', validateObjectId(), deleteAdminReview);

export default router;
