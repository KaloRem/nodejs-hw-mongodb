const Contact = require('../models/contact');

const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Unable to fetch contacts');
  }
};

const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    return contact;
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    throw new Error('Unable to fetch contact');
  }
};

module.exports = { getAllContacts, getContactById };
