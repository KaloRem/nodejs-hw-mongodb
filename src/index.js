require('dotenv').config(); // Załaduj zmienne z pliku .env
const { setupServer } = require('./server');
const { initMongoConnection } = require('./db/initMongoConnection');

// Inicjalizacja połączenia z MongoDB przed uruchomieniem serwera
initMongoConnection().then(() => {
  setupServer(); // Jeśli połączenie się uda, uruchamiamy serwer
});
