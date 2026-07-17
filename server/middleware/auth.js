import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(401);
    throw new Error('Invalid or expired token');
  }
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  req.user = user;
  next();
});

export const adminOnly = (req, res, next) => {
  if (!['admin', 'super_admin'].includes(req.user?.role)) {
    res.status(403);
    throw new Error('Admin access required');
  }
  next();
};
