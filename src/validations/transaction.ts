import Joi from 'joi';
import { ExpressRequest } from '../util/express';
import { Response, NextFunction } from 'express';
import { ResponseType } from '../types';
import ResponseHandler from '../util/response-handler';
import { ACCOUNT_NUMBER_MAX_LENGTH } from '../constants/account';

export async function validateGetTransactions(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const schema = Joi.object().keys({
    customerId: Joi.number().required(),
    accountNumber: Joi.string()
      .regex(/^\d+$/)
      .length(ACCOUNT_NUMBER_MAX_LENGTH)
      .required(),
    skip: Joi.number().min(0),
    limit: Joi.number().min(1),
  });

  const validation = schema.validate(req.body);
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