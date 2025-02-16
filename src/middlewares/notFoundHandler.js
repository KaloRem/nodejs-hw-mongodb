import createError from 'http-errors';

function notFoundHandler(req, res, next) {
  console.log(`Route not found: ${req.method} ${req.originalUrl}`);
  next(createError(404, 'Route not found'));
}

export default notFoundHandler;
