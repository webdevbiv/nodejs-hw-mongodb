import { Contact } from '../models/contact.js';

export const getAllContacts = async (
  skip = 0,
  limit = 10,
  sort = {},
  filter = {},
) => {
  return Contact.find(filter).skip(skip).limit(limit).sort(sort);
};

export const getContactsCount = async (filter = {}) => {
  return Contact.countDocuments(filter);
};

export const getContactById = (id, userId) =>
  Contact.findOne({ _id: id, userId });

export const createContact = (contactData) => Contact.create(contactData);

export const updateContact = (id, updateData, userId) =>
  Contact.findOneAndUpdate({ _id: id, userId }, updateData, { new: true });

export const deleteContact = (id, userId) =>
  Contact.findOneAndDelete({ _id: id, userId });
