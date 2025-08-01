import mongoose from 'mongoose';
import { getEnv } from '../utils/getEnv.js';
import { logger } from '../utils/logger.js';

export async function initMongoConnection() {
  const user = getEnv('MONGODB_USER');
  const password = getEnv('MONGODB_PASSWORD');
  const urlTemplate = getEnv('MONGODB_URL');
  const dbName = getEnv('MONGODB_DB');

  const connectionString = urlTemplate
    .replace('<USER>', user)
    .replace('<PASSWORD>', password)
    .replace('<DB>', dbName);

  try {
    await mongoose.connect(connectionString);
    logger.info(`Mongo connection successfully established!`);
  } catch (error) {
    logger.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
}
