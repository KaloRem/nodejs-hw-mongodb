import createError from 'http-errors';

export default (req, res, next) => {
  next(createError(404, 'Route not found')); // Створення помилки 404, якщо маршрут не знайдений
};
