import express from 'express';
import contactsRouter from './routers/contacts.js'; // Переконайтесь, що шлях правильний
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const app = express();

app.use(express.json()); // Підключення middleware для обробки JSON запитів

// Підключення роутера
app.use('/contacts', contactsRouter); // Тут /contacts повинно співпадати з тим, що ви використовуєте в роутері

// Обробка не знайдених маршрутів
app.use(notFoundHandler);

// Обробка помилок
app.use(errorHandler);

export default app;
