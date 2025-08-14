// src/routes/contacts.js
import express from 'express';
import {
  handleGetAllContacts,
  handleGetContactById,
  handleCreateContact,
  handlePatchContact,
  handleDeleteContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { getContactsQuerySchema } from '../validation/query.js';
import { authenticate } from '../middlewares/authenticate.js';
import { uploadPhoto } from '../middlewares/upload.js';
import { photoMarker } from '../middlewares/photoMarker.js';

const router = express.Router();

router.use(authenticate);

// GET list
router.get(
  '/',
  validateQuery(getContactsQuerySchema),
  ctrlWrapper(handleGetAllContacts),
);

// GET by id
router.get('/:contactId', isValidId, ctrlWrapper(handleGetContactById));

// POST create (supports multipart/form-data with "photo")
router.post(
  '/',
  uploadPhoto,
  validateBody(createContactSchema),
  ctrlWrapper(handleCreateContact),
);

router.patch(
  '/:contactId',
  isValidId,
  uploadPhoto,
  photoMarker,
  validateBody(updateContactSchema),
  ctrlWrapper(handlePatchContact),
);

router.delete('/:contactId', isValidId, ctrlWrapper(handleDeleteContact));

export default router;
