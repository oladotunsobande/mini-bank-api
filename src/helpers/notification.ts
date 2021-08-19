import fs from 'fs';
import appRoot from 'app-root-path';
import { logger } from '../util/logger';
import { NotificationType } from '../types';
import { EVENT_CATEGORIES } from '../constants/notifications';

export function log(payload: NotificationType) {
  const { type, data } = payload;

  const filePath = (type === EVENT_CATEGORIES.INTERACTION)
    ? `${appRoot}/logs/interactions.txt`
    : `${appRoot}/logs/errors.txt`;

  try {
    fs.appendFile(filePath, `\n[${new Date().toISOString()}] - ${data}`, (err) => {
      if (err) throw err;
      logger.info('Notification log written to file successfully');
    });
  } catch (error) {
    logger.error(error);
  }
}