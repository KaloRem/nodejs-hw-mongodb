// src/middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(404).json({
    status: 404,
    message: 'Something went wrong',
    data: err.message,
  });
}

export default errorHandler;
