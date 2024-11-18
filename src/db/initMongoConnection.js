require('dotenv').config(); // Załaduj zmienne środowiskowe z pliku .env
const mongoose = require('mongoose');

const initMongoConnection = async () => {
  const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
    process.env; // Załaduj dane z env

  if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
    console.error('Missing MongoDB connection variables in .env');
    process.exit(1); // Jeśli brakuje zmiennych, kończymy proces
  }

  const mongoUri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

  console.log(`Attempting to connect to MongoDB at ${mongoUri}`);

  try {
    await mongoose.connect(mongoUri);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Jeśli wystąpił błąd podczas połączenia, kończymy proces
  }
};

module.exports = { initMongoConnection };
