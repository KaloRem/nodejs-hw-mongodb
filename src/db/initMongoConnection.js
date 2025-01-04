// src/db/initMongoConnection.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const initMongoConnection = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}`,
      {
        // Залишаємо лише актуальні опції
      },
    );
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};

export default initMongoConnection;
