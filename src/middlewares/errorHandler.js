// src/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
}

export default errorHandler;
