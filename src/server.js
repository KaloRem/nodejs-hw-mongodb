// src/server.js
import express from 'express';
import dotenv from 'dotenv';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

dotenv.config();

const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Лог кожного запиту для діагностики (опціонально)
  app.use((req, res, next) => {
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`,
    );
    next();
  });

  // Маршрут для контактів
  app.use('/contacts', contactsRouter);

  // Middleware для обробки запитів на неіснуючі маршрути
  app.use(notFoundHandler);

  // Middleware для обробки помилок
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

export default setupServer;
