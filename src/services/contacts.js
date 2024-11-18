// src/services/contacts.js
const Contact = require('../models/contact'); // Zaimportowanie modelu

// Funkcja do pobierania wszystkich kontaktów
const getAllContacts = async () => {
  try {
    const contacts = await Contact.find(); // Pobieramy wszystkie kontakty
    return contacts;
  } catch (error) {
    console.error(error);
    throw new Error('Unable to fetch contacts');
  }
};

// Funkcja do pobierania kontaktu po ID
const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId); // Szukamy kontaktu po ID
    return contact; // Zwracamy znaleziony kontakt
  } catch (error) {
    console.error(error);
    throw new Error('Unable to fetch contact');
  }
};

module.exports = { getAllContacts, getContactById };
