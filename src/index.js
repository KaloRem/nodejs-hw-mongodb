import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import contactsRouter from './routes/contacts.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/', contactsRouter);

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal server error' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found!' });
});

mongoose
  .connect(process.env.MONGODB_URL) // Видалено застарілі опції
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));
