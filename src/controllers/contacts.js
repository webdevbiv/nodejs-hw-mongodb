import mongoose from 'mongoose';
import { getAllContacts, getContactById } from '../services/contacts.js';
import { HttpStatus, Messages } from '../constants/index.js';

export const handleGetAllContacts = async (req, res, next) => {
  try {
    const data = await getAllContacts();
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: Messages.CONTACTS_FETCHED,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.isValidObjectId(contactId)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        status: HttpStatus.BAD_REQUEST,
        message: Messages.INVALID_ID(contactId),
      });
    }

    const contact = await getContactById(contactId);

    if (!contact) {
      return res.status(HttpStatus.NOT_FOUND).json({
        status: HttpStatus.NOT_FOUND,
        message: Messages.CONTACT_NOT_FOUND(contactId),
      });
    }

    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: Messages.CONTACT_FOUND(contactId),
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};
