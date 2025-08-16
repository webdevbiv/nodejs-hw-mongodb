// src/server.js
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'node:fs';
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

// Simple ReDoc renderer at /redoc using your docs/index.html template
app.get('/redoc', (_req, res) => {
  const htmlPath = path.resolve('docs', 'index.html');
  if (!fs.existsSync(htmlPath)) {
    return res
      .status(404)
      .send('docs/index.html not found. Add template or run Redocly build.');
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const redocHead = `
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  `;
  const redocHTML = `<redoc spec-url="/docs/openapi.yaml"></redoc>`;

  const rendered = html
    .replace('{{{redocHead}}}', redocHead)
    .replace('{{{redocHTML}}}', redocHTML);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(rendered);
});

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
    logger.info(`ReDoc:      http://localhost:${PORT}/redoc`);
    logger.info(`Docs raw:   http://localhost:${PORT}/docs/openapi.yaml`);
  });
}
