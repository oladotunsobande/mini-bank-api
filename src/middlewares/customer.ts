import { ExpressRequest } from '../util/express';
import { NextFunction, Response } from 'express';
import { ResponseType } from '../types';
import CustomerRepository from '../repositories/CustomerRepository';
import ResponseHandler from '../util/response-handler';

export async function validateCustomerExistence(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { customerId } = req.body;

  try {
    if (!customerId) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: `'customerId' is required`,
      });
    }

    if (isNaN(customerId)) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: `'customerId' must be a number`,
      });
    }

    const customer = await CustomerRepository.getOneBy({ id: customerId });
    if (!customer) {
      return ResponseHandler.sendErrorResponse({
        res,
        status: 404,
        error: 'Customer record does not exist',
      });
    }

    req.customer = customer;

    return next();
  } catch(error) {
    return next(error);
  }
}
