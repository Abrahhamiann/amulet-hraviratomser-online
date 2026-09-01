import asyncHandler from 'express-async-handler';
import { createArcaPayment, refundArcaPayment, verifyArcaPayment } from '../services/paymentService.js';

export const createPayment = asyncHandler(async (req, res) => {
  const result = await createArcaPayment({ user: req.user, body: req.body || {} });
  res.status(201).json(result);
});

export const getPaymentStatus = asyncHandler(async (req, res) => {
  const result = await verifyArcaPayment({ paymentId: req.params.paymentId, user: req.user });
  res.json(result);
});

export const refundPayment = asyncHandler(async (req, res) => {
  const result = await refundArcaPayment(req.params.paymentId);
  res.json(result);
});
