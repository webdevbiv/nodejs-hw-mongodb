import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getEnv } from './utils/getEnv.js';
import { logger } from './utils/logger.js';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

// Initialize the Express application
const app = express();

// Enable CORS for all routes
app.use(cors());
// Enable cookie parsing
app.use(cookieParser());

export function setupServer() {
  logger.info('Setting up server...');
  const PORT = getEnv('PORT', 8080);

  // Middleware to parse JSON bodies
  app.use(express.json());

  // Health check route
  app.get('/', (req, res) => {
    res.send('Contacts API is running.');
  });

  // Routes
  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler
  app.use(errorHandler);

  // Start the server
  app.listen(PORT, () => {
    logger.info(`Server is running on ${PORT}`);
  });
}
