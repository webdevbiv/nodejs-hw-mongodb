import express from 'express';
import cors from 'cors';
import { getEnv } from './utils/getEnv.js';
import { logger } from './utils/logger.js';
import contactsRouter from './routes/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const app = express();
app.use(cors());

export function setupServer() {
  const PORT = getEnv('PORT', 8080);

  app.use(express.json());

  app.use('/contacts', contactsRouter);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  app.listen(PORT, () => {
    logger.info(`Server is running on ${PORT}`);
  });
}
