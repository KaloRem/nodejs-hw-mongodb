require('dotenv').config();

const express = require('express');
const cors = require('cors');
const pino = require('pino');
const pinoHttp = require('pino-http');

function setupServer() {
  const app = express();
  const logger = pino();

  // Middleware
  app.use(cors());
  app.use(pinoHttp({ logger }));

  // Obsługa brakujących tras
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  // Uruchomienie serwera
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { setupServer };
