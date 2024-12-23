import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getContacts, getContact } from './controllers/contactController.js';

const setupServer = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(pino());

  // Routes
  app.get('/contacts', getContacts); // Роут для отримання всіх контактів
  app.get('/contacts/:contactId', getContact); // Новий роут для отримання контакту за ID

  // Обробка неіснуючих роутів
  app.use((req, res, next) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Запуск сервера
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};

export default setupServer;
