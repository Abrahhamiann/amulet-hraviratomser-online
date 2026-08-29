import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import { notifyAdminsOfReview } from '../utils/adminTelegram.js';

export const getPublicReviews = asyncHandler(async (req, res) => {
  const language = String(req.query.language || '').trim().toLowerCase();
  const filter = { status: { $in: ['approved', 'featured'] } };
  if (language) filter.$or = [{ language }, { language: 'all' }];

  let reviews = await Review.find(filter)
    .select('staticKey customer rating text target language source status publishedAt createdAt')
    .sort({ status: -1, publishedAt: -1, createdAt: -1 })
    .limit(60)
    .lean();

  if (!reviews.length && language && language !== 'hy') {
    reviews = await Review.find({ status: { $in: ['approved', 'featured'] } })
      .select('staticKey customer rating text target language source status publishedAt createdAt')
      .sort({ status: -1, publishedAt: -1, createdAt: -1 })
      .limit(60)
      .lean();
  }

  res.set('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  res.json(reviews);
});

export const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ userId: req.user._id }).select('orderId rating text status createdAt');
  res.json(reviews);
});

export const createReview = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.body.orderId,
    $or: [{ userId: req.user._id }, { userId: null, email: req.user.email }],
    paymentStatus: 'paid'
  }).populate('invitationId');
  if (!order) {
    res.status(403);
    throw new Error('A completed purchase is required to add a review');
  }

  const text = String(req.body.text || '').trim().slice(0, 1200);
  const rating = Math.min(5, Math.max(1, Number(req.body.rating) || 5));
  if (text.length < 8) {
    res.status(400);
    throw new Error('Review text is too short');
  }

  if (await Review.exists({ orderId: order._id })) {
    res.status(409);
    throw new Error('A review has already been submitted for this purchase');
  }

  const review = await Review.create({
    userId: req.user._id,
    orderId: order._id,
    invitationId: order.invitationId?._id || order.invitationId || null,
    customer: req.user.name || req.user.email,
    rating,
    text,
    target: order.invitationId?.names || order.mainNames || 'Amulet',
    language: String(req.body.language || 'hy').slice(0, 8).toLowerCase(),
    source: 'user'
  });
  void notifyAdminsOfReview(review, order).catch((error) => {
    console.error('Review Telegram notification failed:', error.message);
  });
  res.status(201).json(review);
});
