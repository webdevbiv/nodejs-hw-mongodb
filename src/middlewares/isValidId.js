import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

export const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    logger.warn(`[CONTACTS] Invalid contact ID: ${contactId}`);
    return res.status(400).json({ message: 'Invalid contact ID' });
  }

  logger.info(`[CONTACTS] Valid contact ID: ${contactId}`);
  next();
};
