import { ExpressRequest } from '../util/express';
import { NextFunction, Response } from 'express';
import { ResponseType } from '../types';
import CustomerRepository from '../repositories/CustomerRepository';
import { Types } from 'mongoose';
import ResponseHandler from '../util/response-handler';

export async function validateCustomerExistence(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { customerId } = req.body;

  if (!Types.ObjectId.isValid(customerId)) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: 'Invalid customer id provided',
    });
  }

  const customer = await CustomerRepository.getOneBy({ id: customerId });
  if (!customer) {
    return ResponseHandler.sendErrorResponse({
      res,
      error: 'Customer record does not exist',
    });
  }

  req.customer = customer;

  return next();
}
