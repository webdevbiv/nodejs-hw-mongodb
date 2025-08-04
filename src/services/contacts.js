import { Contact } from '../validation/contacts.js';

export const getAllContacts = async (skip = 0, limit = 10) => {
  return Contact.find().skip(skip).limit(limit);
};

export const getContactsCount = async () => {
  return Contact.countDocuments();
};

export const getContactById = (id) => Contact.findById(id);

export const createContact = (contactData) => Contact.create(contactData);

export const updateContact = (id, updateData) =>
  Contact.findByIdAndUpdate(id, updateData, { new: true });

export const deleteContact = (id) => Contact.findByIdAndDelete(id);
