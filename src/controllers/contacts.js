import mongoose from 'mongoose';
import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { HttpStatus, Messages } from '../constants/index.js';
import { logger } from '../utils/logger.js';

export const handleGetAllContacts = async (req, res) => {
  const data = await getAllContacts();
  logger.info(`[GET] /contacts -> Fetched ${data.length} contacts`);
  res.status(HttpStatus.OK).json({
    status: HttpStatus.OK,
    message: Messages.CONTACTS_FETCHED,
    data,
  });
};

export const handleGetContactById = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    logger.warn(`[GET] /contacts/${contactId} -> Invalid ID`);
    throw createError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID(contactId));
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    logger.warn(`[GET] /contacts/${contactId} -> Not found`);
    throw createError(
      HttpStatus.NOT_FOUND,
      Messages.CONTACT_NOT_FOUND(contactId),
    );
  }

  logger.info(`[GET] /contacts/${contactId} -> Found`);
  res.status(HttpStatus.OK).json({
    status: HttpStatus.OK,
    message: Messages.CONTACT_FOUND(contactId),
    data: contact,
  });
};

export const handleCreateContact = async (req, res) => {
  const { name, phoneNumber, contactType, email, isFavourite } = req.body;

  if (!name || !phoneNumber || !contactType) {
    logger.warn('[POST] /contacts -> Missing required fields');
    throw createError(
      HttpStatus.BAD_REQUEST,
      'Missing required fields: name, phoneNumber, contactType',
    );
  }

  const newContact = await createContact({
    name,
    phoneNumber,
    contactType,
    email,
    isFavourite,
  });

  logger.info(`[POST] /contacts -> Created new contact: ${newContact._id}`);

  res.status(HttpStatus.CREATED).json({
    status: HttpStatus.CREATED,
    message: 'Successfully created a contact!',
    data: newContact,
  });
};

export const handlePatchContact = async (req, res) => {
  const { contactId } = req.params;
  const updateData = req.body;

  if (!mongoose.isValidObjectId(contactId)) {
    logger.warn(`[PATCH] /contacts/${contactId} -> Invalid ID`);
    throw createError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID(contactId));
  }

  const updated = await updateContact(contactId, updateData);

  if (!updated) {
    logger.warn(`[PATCH] /contacts/${contactId} -> Contact not found`);
    throw createError(
      HttpStatus.NOT_FOUND,
      Messages.CONTACT_NOT_FOUND(contactId),
    );
  }

  logger.info(`[PATCH] /contacts/${contactId} -> Contact updated`);

  res.status(HttpStatus.OK).json({
    status: HttpStatus.OK,
    message: 'Successfully patched a contact!',
    data: updated,
  });
};

export const handleDeleteContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    logger.warn(`[DELETE] /contacts/${contactId} -> Invalid ID`);
    throw createError(400, `Invalid contact ID: ${contactId}`);
  }

  const deleted = await deleteContact(contactId);

  if (!deleted) {
    logger.warn(`[DELETE] /contacts/${contactId} -> Contact not found`);
    throw createError(404, 'Contact not found');
  }

  logger.info(`[DELETE] /contacts/${contactId} -> Contact deleted`);
  res.sendStatus(204); // No Content
};
