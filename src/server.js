// src/server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'node:path';

import { getEnv } from './utils/getEnv.js';
import { logger } from './utils/logger.js';
import contactsRouter from './routes/contacts.js';
import authRouter from './routes/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';

// Initialize the Express application
const app = express();

// Global middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Health check
app.get('/', (_req, res) => {
  res.send('Contacts API is running.');
});

// API routes
app.use('/contacts', contactsRouter);
app.use('/auth', authRouter);

// --- API Docs ---
// Swagger UI
app.use('/api-docs', swaggerDocs());

// Serve /docs folder statically
app.use('/docs', express.static(path.resolve('docs')));

// 404 + error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Bootstrap server
export function setupServer() {
  logger.info('Setting up server...');
  const PORT = getEnv('PORT', 3000);

  app.listen(PORT, () => {
    logger.info(`Server is running on ${PORT}`);
    logger.info(`Swagger UI: http://localhost:${PORT}/api-docs`);
    logger.info(`Docs raw:   http://localhost:${PORT}/docs/openapi.yaml`);
  });
}
