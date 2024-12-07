import Contact from '../models/contactModel.js';

export const getAllContacts = async () => {
  try {
    const contacts = await Contact.find(); // Отримати всі контакти з бази
    return contacts;
  } catch {
    throw new Error('Error fetching contacts');
  }
};

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId); // Використовуємо findById для пошуку за ID
    if (!contact) {
      throw new Error('Contact not found'); // Якщо контакт не знайдений
    }
    return contact; // Повертаємо знайдений контакт
  } catch (error) {
    console.error('Error fetching contact:', error); // Логуємо деталі помилки
    throw new Error('Error fetching contact'); // Генеруємо помилку, щоб вона потрапила в catch у контролері
  }
};
