import { getAllContacts, getContactById } from '../services/contacts.js';

// Контролер для роута GET /contacts
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await getAllContacts(); // Функція, яка повертає всі контакти
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

// Контролер для роута GET /contacts/:contactId
export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
