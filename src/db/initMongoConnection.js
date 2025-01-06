import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

const initMongoConnection = async () => {
  try {
    await mongoose.connect(MONGODB_URL); // Підключення без застарілих параметрів
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Зупинити процес у разі помилки
  }
};

export default initMongoConnection;
