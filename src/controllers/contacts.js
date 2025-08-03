import mongoose from 'mongoose';
import createError from 'http-errors';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { HttpStatus, Messages } from '../constants/index.js';
import { logger } from '../utils/logger.js';

export const handleGetAllContacts = async (req, res) => {
  const data = await getAllContacts();

  logger.info(
    `[${req.method}] ${req.originalUrl} -> Fetched ${data.length} contacts`,
  );

  res.status(HttpStatus.OK).json({
    status: HttpStatus.OK,
    message: Messages.CONTACTS_FETCHED,
    data,
  });
};

export const handleGetContactById = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    logger.warn(
      `[${req.method}] ${req.originalUrl} -> Invalid ID: ${contactId}`,
    );
    throw createError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID(contactId));
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    logger.warn(
      `[${req.method}] ${req.originalUrl} -> Contact not found: ${contactId}`,
    );
    throw createError(
      HttpStatus.NOT_FOUND,
      Messages.CONTACT_NOT_FOUND(contactId),
    );
  }

  logger.info(
    `[${req.method}] ${req.originalUrl} -> Contact found: ${contactId}`,
  );

  res.status(HttpStatus.OK).json({
    status: HttpStatus.OK,
    message: Messages.CONTACT_FOUND(contactId),
    data: contact,
  });
};
