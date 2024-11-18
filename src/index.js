require('dotenv').config();
const { setupServer } = require('./server'); // Poprawny import

// Inicjalizacja połączenia z MongoDB (zakładając, że masz funkcję initMongoConnection)
const { initMongoConnection } = require('./db/initMongoConnection');

initMongoConnection().then(() => {
  setupServer(); // Teraz wywołanie funkcji będzie działać
});
