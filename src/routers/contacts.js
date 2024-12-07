import express from 'express';
import { getContacts, getContact } from '../controllers/contacts.js'; // Правильність шляхів
import ctrlWrapper from '../utils/ctrlWrapper.js';

const router = express.Router();

// Роут для отримання всіх контактів
router.get('/', ctrlWrapper(getContacts));

// Роут для отримання одного контакту за ID
router.get('/:contactId', ctrlWrapper(getContact));

export default router;
