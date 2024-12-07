import Contact from '../models/contactModel.js';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch {
    throw new Error('Error fetching contacts');
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw new Error('Error fetching contact');
  }
};
