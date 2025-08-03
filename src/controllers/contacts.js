import mongoose from 'mongoose';
import createError from 'http-errors';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { HttpStatus, Messages } from '../constants/index.js';

export const handleGetAllContacts = async (req, res) => {
  const data = await getAllContacts();
  res.status(HttpStatus.OK).json({
    status: HttpStatus.OK,
    message: Messages.CONTACTS_FETCHED,
    data,
  });
};

export const handleGetContactById = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    throw createError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID(contactId));
  }

  const contact = await getContactById(contactId);

  if (!contact) {
    throw createError(
      HttpStatus.NOT_FOUND,
      Messages.CONTACT_NOT_FOUND(contactId),
    );
  }

  res.status(HttpStatus.OK).json({
    status: HttpStatus.OK,
    message: Messages.CONTACT_FOUND(contactId),
    data: contact,
  });
};
