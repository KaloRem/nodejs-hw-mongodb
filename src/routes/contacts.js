import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
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

router.get('/contacts', getContacts); // Отримати всі контакти
router.get('/contacts/:contactId', isValidId, getContactById); // Отримати контакт за ID
router.post('/contacts', validateBody(contactSchema), createContact); // Створити новий контакт
router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(contactUpdateSchema),
  updateContact,
); // Оновити контакт
router.delete('/contacts/:contactId', isValidId, deleteContactById); // Видалити контакт

export default router;
