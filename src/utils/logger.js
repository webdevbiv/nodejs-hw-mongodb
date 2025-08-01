import pino from 'pino';
import { getEnv } from './getEnv.js';

export const logger = pino({
  level: getEnv('LOG_LEVEL', 'info'),
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
});
