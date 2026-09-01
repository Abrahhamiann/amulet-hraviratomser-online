export const notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? (err.statusCode || 500) : res.statusCode;
  const payload = { message: err.publicMessage || err.message || 'Server error' };
  if (err.publicCode) {
    payload.success = false;
    payload.code = err.publicCode;
  }
  res.status(statusCode).json(payload);
};
