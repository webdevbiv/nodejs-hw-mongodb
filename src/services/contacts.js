import { Contact } from '../validation/contacts.js';

export const getAllContacts = () => Contact.find();

export const getContactById = (id) => Contact.findById(id);

export const createContact = (contactData) => Contact.create(contactData);

export const updateContact = (id, updateData) =>
  Contact.findByIdAndUpdate(id, updateData, { new: true });

export const deleteContact = (id) => Contact.findByIdAndDelete(id);
