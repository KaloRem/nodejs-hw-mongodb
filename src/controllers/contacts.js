import { getAllContacts, getContactById } from '../services/contacts.js'; // Правильність шляху
import createError from 'http-errors';

// Контролер для отримання всіх контактів
export const getContacts = async (req, res, next) => {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error); // Перенаправлення на обробник помилок
  }
};

// Контролер для отримання контакту за ID
export const getContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    if (!contact) {
      throw createError(404, 'Contact not found'); // Створення помилки, якщо контакт не знайдений
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error); // Перенаправлення на обробник помилок
  }
};
