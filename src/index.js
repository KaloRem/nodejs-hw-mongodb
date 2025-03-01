import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import contactsRouter from './routes/contacts.js';
import path from 'path';
import cors from 'cors';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/swagger', express.static(path.join(process.cwd(), 'swagger')));
app.use('/api-docs', swaggerDocs());
app.use('/auth', authRouter);
app.use('/contacts', contactsRouter);

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal server error' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found!' });
});

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log('✅ Database connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));

export default app;
