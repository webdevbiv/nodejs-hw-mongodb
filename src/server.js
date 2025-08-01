import express from 'express';
import cors from 'cors';
import { getEnv } from './utils/getEnv.js';
import { logger } from './utils/logger.js';

const app = express();
app.use(cors());

export function setupServer() {
  const PORT = getEnv('PORT', 8080);

  // Middleware to parse JSON requests
  app.use(express.json());

  // Sample route
  app.get('/', (req, res) => {
    res.send('Hello, World!');
    logger.info('Root route accessed');
  });

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
