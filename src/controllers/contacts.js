// src/controllers/contacts.js
import path from 'node:path';
import os from 'node:os';
import { promises as fs } from 'node:fs';

import createError from 'http-errors';
import mongoose from 'mongoose';

import { Contact } from '../models/contact.js';
import { HttpStatus, Messages } from '../constants/index.js';
import { uploadToCloudinary } from '../services/cloudinary.js';

async function uploadMulterFileToCloudinary(file) {
  if (!file) return null;
  const tmpPath = path.join(os.tmpdir(), `${Date.now()}-${file.originalname}`);
  await fs.writeFile(tmpPath, file.buffer);
  try {
    const url = await uploadToCloudinary(tmpPath);
    return url;
  } finally {
    fs.unlink(tmpPath).catch(() => {});
  }
}

export const handleGetAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id });
    res.status(HttpStatus.OK).json({
      status: 'success',
      message: Messages.CONTACTS_FETCHED,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.isValidObjectId(contactId)) {
      throw createError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID(contactId));
    }

    const contact = await Contact.findOne({
      _id: contactId,
      userId: req.user._id,
    });

    if (!contact) {
      throw createError(
        HttpStatus.NOT_FOUND,
        Messages.CONTACT_NOT_FOUND(contactId),
      );
    }

    res.status(HttpStatus.OK).json({
      status: 'success',
      message: Messages.CONTACT_FETCHED(contactId),
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const handleCreateContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    let photoUrl = null;
    if (req.file) {
      photoUrl = await uploadMulterFileToCloudinary(req.file);
    }

    const contact = await Contact.create({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId: req.user._id,
      photo: photoUrl,
    });

    res.status(HttpStatus.CREATED).json({
      status: 'success',
      message: Messages.CONTACT_CREATED,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const handleDeleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.isValidObjectId(contactId)) {
      throw createError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID(contactId));
    }

    const deleted = await Contact.findOneAndDelete({
      _id: contactId,
      userId: req.user._id,
    });

    if (!deleted) {
      throw createError(
        HttpStatus.NOT_FOUND,
        Messages.CONTACT_NOT_FOUND(contactId),
      );
    }

    res.sendStatus(HttpStatus.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};

export const handlePatchContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.isValidObjectId(contactId)) {
      throw createError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID(contactId));
    }

    const update = { ...req.body };

    if (req.file) {
      const photoUrl = await uploadMulterFileToCloudinary(req.file);
      update.photo = photoUrl;
    }

    const updated = await Contact.findOneAndUpdate(
      { _id: contactId, userId: req.user._id },
      update,
      { new: true },
    );

    if (!updated) {
      throw createError(
        HttpStatus.NOT_FOUND,
        Messages.CONTACT_NOT_FOUND(contactId),
      );
    }

    res.status(HttpStatus.OK).json({
      status: 'success',
      message: Messages.CONTACT_UPDATED,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const handleUpdateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!mongoose.isValidObjectId(contactId)) {
      throw createError(HttpStatus.BAD_REQUEST, Messages.INVALID_ID(contactId));
    }

    const updated = await Contact.findOneAndUpdate(
      { _id: contactId, userId: req.user._id },
      { isFavourite: req.body.isFavourite },
      { new: true },
    );

    if (!updated) {
      throw createError(
        HttpStatus.NOT_FOUND,
        Messages.CONTACT_NOT_FOUND(contactId),
      );
    }

    res.status(HttpStatus.OK).json({
      status: 'success',
      message: Messages.CONTACT_UPDATED,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
