import 'dotenv/config';
import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';

const startApp = async () => {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Error during app initialization', error);
  }
};

startApp();
