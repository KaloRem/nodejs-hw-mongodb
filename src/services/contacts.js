import mongoose from 'mongoose';
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
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    throw new Error('Invalid contact ID');
  }

  try {
    const contact = await Contact.findById(contactId);
    return contact || null;
  } catch (error) {
    console.error('Error fetching contact:', error);
    throw new Error('Error fetching contact');
  }
};
