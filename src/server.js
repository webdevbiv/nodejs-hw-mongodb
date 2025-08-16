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

function resolveBaseUrl(port) {
  const { PUBLIC_URL, RENDER_EXTERNAL_URL, VERCEL_URL, RAILWAY_PUBLIC_DOMAIN } =
    process.env;

  const fromPaaS =
    PUBLIC_URL ||
    RENDER_EXTERNAL_URL ||
    (VERCEL_URL && `https://${VERCEL_URL}`) ||
    (RAILWAY_PUBLIC_DOMAIN && `https://${RAILWAY_PUBLIC_DOMAIN}`);

  const base = (fromPaaS || `http://localhost:${port}`).replace(/\/+$/, '');
  return base;
}

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
  const baseURL = resolveBaseUrl(PORT);

  app.listen(PORT, () => {
    logger.info(`Server is running on ${baseURL}`);
    logger.info(`Swagger UI: ${baseURL}/api-docs`);
    logger.info(`Docs raw:   ${baseURL}/docs/openapi.yaml`);
  });
}
