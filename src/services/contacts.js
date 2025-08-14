import express from 'express';
import {
  listContacts,
  getContactById,
  createContact,
  removeContact,
  updateContact,
  updateStatusContact,
} from '../controllers/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from '../validation/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { uploadPhoto } from '../middlewares/upload.js';

const router = express.Router();

// All contacts routes are protected
router.use(authenticate);

// Get list
router.get('/', ctrlWrapper(listContacts));

// Get by id
router.get('/:contactId', isValidId, ctrlWrapper(getContactById));

// Create contact
router.post(
  '/',
  uploadPhoto,
  validateBody(createContactSchema),
  ctrlWrapper(createContact),
);

// Delete
router.delete('/:contactId', isValidId, ctrlWrapper(removeContact));

// Update contact
router.patch(
  '//:contactId',
  isValidId,
  uploadPhoto,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact),
);

// Update status
router.patch(
  '/:contactId/favorite',
  isValidId,
  validateBody(updateStatusSchema),
  ctrlWrapper(updateStatusContact),
);

export default router;
