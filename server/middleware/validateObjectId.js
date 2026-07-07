import mongoose from 'mongoose';

export const validateObjectId = (param = 'id') => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
    res.status(400);
    return next(new Error('Invalid MongoDB id'));
  }
  next();
};
