const Contact = require('../models/contact'); // Importujemy model

// Funkcja do pobierania wszystkich kontaktów
const getAllContacts = async () => {
  try {
    const contacts = await Contact.find(); // Pobieramy wszystkie kontakty
    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw new Error('Unable to fetch contacts');
  }
};

// Funkcja do pobierania kontaktu po ID
const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId); // Pobieramy kontakt po ID
    return contact;
  } catch (error) {
    console.error('Error fetching contact by ID:', error);
    throw new Error('Unable to fetch contact');
  }
};

module.exports = { getAllContacts, getContactById };
