import jwt from 'jsonwebtoken';

export const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role, v: Number(user.tokenVersion) || 0 }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
