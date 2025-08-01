import './utils/env.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

async function bootstrap() {
  try {
    await initMongoConnection();
    setupServer();
  } catch (error) {
    console.error('Failed to start application:', error.message);
    process.exit(1);
  }
}

bootstrap();
