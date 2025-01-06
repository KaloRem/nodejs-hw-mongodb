import createError from 'http-errors';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import * as service from '../services/contacts.js'; // Імпортуємо всі методи з сервісу

// Отримати всі контакти
export const getContacts = ctrlWrapper(async (req, res) => {
  const contacts = await service.getAllContacts();
  res.status(200).json({ status: 200, data: contacts });
});

// Отримати контакт за ID
export const getContactById = ctrlWrapper(async (req, res) => {
  const contact = await service.getContactById(req.params.contactId);
  if (!contact) throw createError(404, 'Contact not found');
  res.status(200).json({ status: 200, data: contact });
});

// Створити новий контакт
export const createContact = ctrlWrapper(async (req, res) => {
  const newContact = await service.createContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
});

// Оновити контакт за ID
export const updateContact = ctrlWrapper(async (req, res) => {
  const updatedContact = await service.updateContact(
    req.params.contactId,
    req.body,
  );
  if (!updatedContact) throw createError(404, 'Contact not found');
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
});

// Видалити контакт за ID
export const deleteContact = ctrlWrapper(async (req, res) => {
  const deletedContact = await service.deleteContact(req.params.contactId);
  if (!deletedContact) throw createError(404, 'Contact not found');
  res.status(204).send(); // Повертаємо статус 204 без тіла відповіді
});
