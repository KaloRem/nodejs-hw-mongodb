// src/routers/contacts.js
import express from 'express';
import {
  createContact,
  getContactById,
  updateContact,
  deleteContact,
  getContacts,
} from '../controllers/contactController.js';

const router = express.Router();

// Створення контакту
router.post('/', createContact);

// Отримання всіх контактів
router.get('/', getContacts);

// Отримання контакту за ID
router.get('/:contactId', getContactById);

// Оновлення контакту
router.patch('/:contactId', updateContact);

// Видалення контакту
router.delete('/:contactId', deleteContact);

export default router;
