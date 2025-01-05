import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import {
  contactSchema,
  contactUpdateSchema,
} from '../models/validationSchemas.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  getContacts,
  createContact,
  updateContact,
} from '../controllers/contactController.js';

const router = express.Router();

router.get('/contacts', getContacts);
router.post('/contacts', validateBody(contactSchema), createContact);
router.patch(
  '/contacts/:contactId',
  isValidId,
  validateBody(contactUpdateSchema),
  updateContact,
);

export default router;
