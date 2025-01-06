const errorHandler = (err, req, res, next) => {
  const status = err.status || 500; // Статус помилки (за замовчуванням 500)
  const message = err.message || 'Something went wrong'; // Повідомлення помилки

  res.status(status).json({
    status,
    message,
    data: err.message || 'Internal Server Error', // Відображаємо конкретне повідомлення помилки
  });
};

export default errorHandler;
