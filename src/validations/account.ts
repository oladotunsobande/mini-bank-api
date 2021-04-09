import Joi from 'joi';
import { ExpressRequest } from '../util/express';
import { Response, NextFunction } from 'express';
import { ResponseType } from '../types';
import ResponseHandler from '../util/response-handler';
import { 
  ACCOUNT_CATEGORIES,
  ACCOUNT_NUMBER_MAX_LENGTH,
} from '../constants/account';

export async function validateCreateAccount(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const schema = Joi.object().keys({
    customerId: Joi.number().required(),
    category: Joi.string()
      .valid(...Object.values(ACCOUNT_CATEGORIES))
      .required(),
    deposit: Joi.number().positive(),
    bvn: Joi.string(),
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

export async function validateTransferFunds(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const schema = Joi.object().keys({
    customerId: Joi.number().required(),
    sourceAccount: Joi.string()
      .regex(/^\d+$/)
      .length(ACCOUNT_NUMBER_MAX_LENGTH)
      .required(),
    destinationAccount: Joi.string()
      .regex(/^\d+$/)
      .length(ACCOUNT_NUMBER_MAX_LENGTH)
      .required(),
    amount: Joi.number().positive().required(),
    destinationAccountBelongsToCustomer: Joi.boolean().required(),
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

export async function validateGetBalance(
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