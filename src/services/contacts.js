import Contact from '../models/contactModel.js';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find(); // Отримати всі контакти з бази
    return contacts;
  } catch {
    throw new Error('Error fetching contacts');
  }
};
