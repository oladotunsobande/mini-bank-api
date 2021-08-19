import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { ExpressRequest } from '../util/express';
import { NextFunction, Response } from 'express';
import { ResponseType } from '../types';
import { TOKEN_SECRET } from '../config/env';
import { throwIfUndefined } from '../helpers';
import CustomerRepository from '../repositories/CustomerRepository';
import ResponseHandler from '../util/response-handler';

export async function validateCustomerToken(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  let { authorization } = req.headers;

  const schema = Joi.object()
    .keys({
      authorization: Joi.string()
        .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        .required()
        .label('authorization [header]'),
    })
    .unknown(true);
  const validation = schema.validate(req.headers);
  if (validation.error) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: validation.error.details[0].message,
    });
  }

  try {
    authorization = throwIfUndefined(authorization, 'authorization');

    const [, token] = authorization.split('Bearer ');
    let decoded: { id: number; };

    try {
      decoded = jwt.verify(token, TOKEN_SECRET) as {
        id: number;
      };
    } catch {
      return ResponseHandler.sendErrorResponse({
        res,
        status: 401,
        error: 'Invalid access token provided',
      });
    }

    const customer = await CustomerRepository.getOneBy({ id: decoded.id });
    if (!customer) {
      return ResponseHandler.sendErrorResponse({
        res,
        status: 401,
        error: 'Invalid access token provided',
      });
    }

    req.customer = customer;

    return next();
  } catch (error) {
    return next(error);
  }
}
