import express from 'express';
import cors from 'cors';
import { getEnv } from './utils/getEnv.js';
import { logger } from './utils/logger.js';
import contactsRouter from './routes/contacts.js';
import { HttpStatus, Messages } from './constants/index.js';

const app = express();
app.use(cors());

export function setupServer() {
  const PORT = getEnv('PORT', 8080);

  app.use(express.json());

  app.use('/contacts', contactsRouter);

  // 404 handler
  app.use((req, res) => {
    logger.warn(`Not Found: ${req.method} ${req.originalUrl}`);
    res.status(HttpStatus.NOT_FOUND).json({
      status: HttpStatus.NOT_FOUND,
      message: Messages.NOT_FOUND,
    });
  });

  app.listen(PORT, () => {
    logger.info(`Server is running on ${PORT}`);
  });
}
