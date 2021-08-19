import { createReadStream } from 'fs';
import appRoot from 'app-root-path';
import { ExpressRequest } from '../util/express';
import { Response, NextFunction } from 'express';
import { ResponseType } from '../types';
import { EVENT_CATEGORY_NAMES } from '../constants/notifications';
import { logger } from '../util/logger';

export async function getLogFile(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { category } = req.params;

  try {
    const readStream = (category === EVENT_CATEGORY_NAMES.INTERACTION)
      ? createReadStream(`${appRoot}/logs/interactions.txt`)
      : createReadStream(`${appRoot}/logs/errors.txt`);
    
    readStream.pipe(res);

    readStream.on('error', (err: Error) => {
      logger.error('An error occurred while reading log file.');
    });    
    
    res.on('error', (err: Error) => {
      logger.error('An error occurred while downloading file.');
    });
    
    readStream.on('end', () => {
      res.status(200).send();
    });
  } catch (error) {
    return next(error);
  }
}