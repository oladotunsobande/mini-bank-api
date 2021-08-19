import Joi from 'joi';
import { ExpressRequest } from '../util/express';
import { Response, NextFunction } from 'express';
import { ResponseType } from '../types';
import ResponseHandler from '../util/response-handler';
import { EVENT_CATEGORY_NAMES } from '../constants/notifications';

export async function validateDownloadLog(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const schema = Joi.object().keys({
    category: Joi.string()
      .valid(...Object.values(EVENT_CATEGORY_NAMES))
      .required(),
  });

  const validation = schema.validate(req.params);
  if (validation.error) {
    const error = validation.error.message
      ? validation.error.message
      : validation.error.details[0].message;
    return ResponseHandler.sendErrorResponse({
      res,
      error,
    });
  }

  return next();
}