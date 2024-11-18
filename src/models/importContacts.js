const mongoose = require('mongoose');
const Contact = require('./contact');
const contactsData = require('./contacts.json');

require('dotenv').config();

const { MONGO_URI } = process.env;

console.log(`MONGO_URI: ${MONGO_URI}`);

const importContacts = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await Contact.insertMany(contactsData);
    console.log('Contacts have been imported');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error importing contacts:', error);
  }
};

importContacts();
