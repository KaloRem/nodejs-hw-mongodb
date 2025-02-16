import express from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
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
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getContacts);

router.get('/:contactId', authenticate, isValidId, getContactById);

router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(contactSchema),
  createContact,
);

router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  upload.single('photo'),
  validateBody(contactUpdateSchema),
  updateContact,
);

router.delete('/:contactId', authenticate, isValidId, deleteContactById);

export default router;
