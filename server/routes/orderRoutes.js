import express from 'express';
import { createOrder, deleteMyOrder, getMyOrders, getOrder, getOrders, updateOrderStatus } from '../controllers/orderController.js';
import { adminOnly, protect } from '../middleware/auth.js';
import { validateObjectId } from '../middleware/validateObjectId.js';

const router = express.Router();

router.route('/').post(createOrder).get(protect, adminOnly, getOrders);
router.get('/my/list', protect, getMyOrders);
router.delete('/my/:id', validateObjectId(), protect, deleteMyOrder);
router.get('/:id', validateObjectId(), protect, adminOnly, getOrder);
router.patch('/:id/status', validateObjectId(), protect, adminOnly, updateOrderStatus);

export default router;
