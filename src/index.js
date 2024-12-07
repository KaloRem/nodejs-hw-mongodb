import 'dotenv/config';
import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';
import Contact from './models/contactModel.js';

const startApp = async () => {
  try {
    await initMongoConnection();

    const contacts = await Contact.find();
    console.log('Contacts in database:', contacts);

    setupServer();
  } catch (error) {
    console.error('Error during app initialization', error);
  }
};

startApp();
