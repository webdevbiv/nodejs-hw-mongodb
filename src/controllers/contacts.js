import mongoose from 'mongoose';
import createError from 'http-errors';

import {
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getAllContacts,
  getContactsCount,
} from '../services/contacts.js';

import { HttpStatus, Messages } from '../constants/index.js';
import { logger } from '../utils/logger.js';

export const handleGetAllContacts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const skip = (page - 1) * perPage;

  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
  const sortOptions = { [sortBy]: sortOrder };

  const filter = { userId: req.user._id };

  if (req.query.type) {
    filter.contactType = req.query.type;
  }

  if (req.query.isFavourite !== undefined) {
    filter.isFavourite = req.query.isFavourite === 'true';
  }

  logger.info(
    `[GET] /contacts -> page=${page}, perPage=${perPage}, sortBy=${sortBy}, sortOrder=${
      req.query.sortOrder || 'asc'
    }, filter=${JSON.stringify(filter)}`,
  );

  const [totalItems, contacts] = await Promise.all([
    getContactsCount(filter),
    getAllContacts(skip, perPage, sortOptions, filter),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  logger.info(`[GET] /contacts -> Returned ${contacts.length} contacts`);

  res.status(HttpStatus.OK).json({
    status: HttpStatus.OK,
    message: Messages.CONTACTS_FETCHED,
    data: {
      data: contacts,
      page,
      perPage,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    },
  });
};

export const handleGetContactById = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    logger.warn(`[GET] /contacts/${contactId} -> Invalid ID`);

    throw createError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID(contactId));
  }

  const contact = await getContactById(contactId, req.user._id);

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
  const newContact = await createContact({ ...req.body, userId: req.user._id });

  logger.info(`[POST] /contacts -> Created contact ${newContact._id}`);

  res.status(HttpStatus.CREATED).json({
    status: HttpStatus.CREATED,
    message: Messages.CONTACT_CREATED,
    data: newContact,
  });
};

export const handlePatchContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    logger.warn(`[PATCH] /contacts/${contactId} -> Invalid ID`);

    throw createError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID(contactId));
  }

  const updated = await updateContact(contactId, req.body, req.user._id);

  if (!updated) {
    logger.warn(`[PATCH] /contacts/${contactId} -> Not found`);

    throw createError(
      HttpStatus.NOT_FOUND,
      Messages.CONTACT_NOT_FOUND(contactId),
    );
  }

  logger.info(`[PATCH] /contacts/${contactId} -> Updated`);

  res.status(HttpStatus.OK).json({
    status: HttpStatus.OK,
    message: Messages.CONTACT_UPDATED,
    data: updated,
  });
};

export const handleDeleteContact = async (req, res) => {
  const { contactId } = req.params;

  if (!mongoose.isValidObjectId(contactId)) {
    logger.warn(`[DELETE] /contacts/${contactId} -> Invalid ID`);

    throw createError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID(contactId));
  }

  const deleted = await deleteContact(contactId, req.user._id);

  if (!deleted) {
    logger.warn(`[DELETE] /contacts/${contactId} -> Not found`);

    throw createError(
      HttpStatus.NOT_FOUND,
      Messages.CONTACT_NOT_FOUND(contactId),
    );
  }

  logger.info(`[DELETE] /contacts/${contactId} -> Deleted`);

  res.sendStatus(HttpStatus.NO_CONTENT);
};
