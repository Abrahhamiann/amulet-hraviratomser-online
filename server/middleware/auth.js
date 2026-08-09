import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authCookieName } from '../utils/authCookie.js';

const authenticate = async (req) => {
  const token = req.cookies?.[authCookieName()];
  if (!token) return null;

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }

  const user = await User.findById(decoded.id).select('+tokenVersion');
  if (!user || (Number(decoded.v) || 0) !== (Number(user.tokenVersion) || 0)) return null;
  return user;
};

export const protect = asyncHandler(async (req, res, next) => {
  const user = await authenticate(req);
  if (!user) {
    res.status(401);
    throw new Error('Not authorized');
  }
  req.user = user;
  next();
});

export const optionalAuth = asyncHandler(async (req, res, next) => {
  req.user = await authenticate(req);
  next();
});

export const adminOnly = (req, res, next) => {
  if (!['admin', 'super_admin'].includes(req.user?.role)) {
    res.status(403);
    throw new Error('Admin access required');
  }
  next();
};
