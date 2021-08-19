import fs from 'fs';
import appRoot from 'app-root-path';
import { logger } from '../util/logger';
import { NotificationType } from '../types';
import { EVENT_CATEGORIES } from '../constants/notifications';

export function log(payload: NotificationType) {
  const { type, data } = payload;

  const writeStream = (type === EVENT_CATEGORIES.INTERACTION)
    ? fs.createWriteStream(`${appRoot}/logs/interactions.txt`)
    : fs.createWriteStream(`${appRoot}/logs/errors.txt`);
  
  writeStream.write(`\n[${new Date().toISOString()}] - ${data}`, 'utf8');

  writeStream.on('finish', () => {
    logger.info('Notification log written to file successfully');
  });

  writeStream.end();
}