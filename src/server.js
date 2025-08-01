import express from 'express';
import cors from 'cors';
import { getEnv } from './utils/getEnv.js';
import { logger } from './utils/logger.js';
import contactsRouter from './routes/contacts.js';

const app = express();
app.use(cors());

export function setupServer() {
  const PORT = getEnv('PORT', 8080);

  // Middleware to parse JSON requests
  app.use(express.json());

  // Set up routes
  app.use('/contacts', contactsRouter);

  // 404 error handler
  app.use((req, res) => {
    logger.warn(`Not Found`);
    res.status(404).json({
      status: 404,
      message: 'Not found',
    });
  });

  // Start the server
  app.listen(PORT, () => {
    logger.info(`Server is running on ${PORT}`);
  });
}
