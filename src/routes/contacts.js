import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js'; // Import middleware
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContactById,
} from '../controllers/contactController.js';
import {
  contactSchema,
  contactUpdateSchema,
} from '../models/validationSchemas.js';

const router = express.Router();

router.get('/contacts', authenticate, getContacts); // Pobranie wszystkich kontaktów (tylko dla zalogowanych użytkowników)
router.get('/contacts/:contactId', authenticate, isValidId, getContactById); // Pobranie kontaktu po ID
router.post(
  '/contacts',
  authenticate,
  validateBody(contactSchema),
  createContact,
); // Tworzenie nowego kontaktu
router.patch(
  '/contacts/:contactId',
  authenticate,
  isValidId,
  validateBody(contactUpdateSchema),
  updateContact,
); // Aktualizacja kontaktu
router.delete(
  '/contacts/:contactId',
  authenticate,
  isValidId,
  deleteContactById,
); // Usunięcie kontaktu

export default router;
