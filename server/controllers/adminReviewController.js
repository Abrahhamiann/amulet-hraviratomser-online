import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';

const allowedStatuses = new Set(['pending', 'approved', 'rejected', 'featured']);
const allowedSources = new Set(['user', 'static', 'admin']);

const normalizeReview = (body, existing = {}) => {
  const status = allowedStatuses.has(body.status) ? body.status : (existing.status || 'pending');
  const source = allowedSources.has(body.source) ? body.source : (existing.source || 'admin');
  const customer = String(body.customer ?? existing.customer ?? '').trim().slice(0, 120);
  const text = String(body.text ?? existing.text ?? '').trim().slice(0, 1200);
  const target = String(body.target ?? existing.target ?? 'Amulet').trim().slice(0, 160) || 'Amulet';
  const language = String(body.language ?? existing.language ?? 'hy').trim().toLowerCase().slice(0, 8) || 'hy';
  const rating = Math.min(5, Math.max(1, Number(body.rating ?? existing.rating) || 5));

  if (customer.length < 2 || text.length < 8) {
    const error = new Error('Customer and review text are required');
    error.statusCode = 400;
    throw error;
  }

  return {
    customer,
    text,
    target,
    language,
    rating,
    source,
    status,
    publishedAt: ['approved', 'featured'].includes(status)
      ? (existing.publishedAt || new Date())
      : null
  };
};

export const getAdminReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find()
    .populate('userId', 'name email')
    .populate('orderId', 'orderNumber paymentStatus')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

export const createAdminReview = asyncHandler(async (req, res) => {
  let normalized;
  try {
    normalized = normalizeReview(req.body);
  } catch (error) {
    res.status(error.statusCode || 400);
    throw error;
  }
  const review = await Review.create(normalized);
  res.status(201).json(review);
});

export const updateAdminReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  try {
    Object.assign(review, normalizeReview(req.body, review.toObject()));
  } catch (error) {
    res.status(error.statusCode || 400);
    throw error;
  }
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
  res.json({ success: true });
});
