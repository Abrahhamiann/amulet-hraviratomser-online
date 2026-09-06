export const notFound = (req, res, next) => {
  const error = new Error('Not found');
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  let statusCode = res.statusCode >= 400 ? res.statusCode : (err.statusCode || err.status || 500);
  let message = err.publicMessage || err.message || 'Server error';
  if (err.name === 'ValidationError' || err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid request data';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Record already exists';
  } else if (err.type === 'entity.parse.failed') {
    message = 'Invalid JSON body';
  }
  if (!Number.isInteger(statusCode) || statusCode < 400 || statusCode > 599) statusCode = 500;
  if (statusCode >= 500) message = err.publicMessage || 'Server error';
  const payload = { message };
  if (err.publicCode) {
    payload.success = false;
    payload.code = err.publicCode;
  }
  res.status(statusCode).json(payload);
};
