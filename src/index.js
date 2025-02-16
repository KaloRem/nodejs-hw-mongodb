import express from 'express';
import multer from 'multer';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.js';
import contactsRouter from './routes/contacts.js';
import './services/cloudinaryService.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', contactsRouter);
app.use('/auth', authRouter);

const upload = multer({ dest: 'uploads/' });
export { app, upload };

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
    console.log('Database connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('Database connection error:', err));

console.log('🔍 CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('🔍 CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY);
console.log(
  '🔍 CLOUDINARY_API_SECRET:',
  process.env.CLOUDINARY_API_SECRET ? 'OK' : 'Brak wartości!',
);
