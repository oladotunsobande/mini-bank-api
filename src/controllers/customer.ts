import { ExpressRequest } from '../util/express';
import { Response, NextFunction } from 'express';
import { ResponseType } from '../types';
import ResponseHandler from '../util/response-handler';
import { getCustomerId } from '../helpers/customer';
import { getAccountNumber } from '../helpers/account';
import { ACCOUNT_STATUSES, ACCOUNT_CATEGORIES } from '../constants/account';
import AccountRepository from '../repositories/AccountRepository';
import CustomerRepository from '../repositories/CustomerRepository';

export async function create(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { name, email, password } = req.body;

  try {
    const existingCustomer = await CustomerRepository.getOneBy({ email });
    if (existingCustomer) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: 'The email provided already exists',
      });
    }

    const customerId = await getCustomerId();

    const customer = await CustomerRepository.create({
      id: customerId,
      name,
      email,
      password,
    });

    const accountNumber = await getAccountNumber();

    await AccountRepository.create({
      customerId: customer._id,
      category: ACCOUNT_CATEGORIES.SAVINGS,
      accountNumber,
      status: ACCOUNT_STATUSES.ACTIVE,
    });

    return ResponseHandler.sendSuccessResponse({
      res,
      message: 'Customer account created successfully',
    });
  } catch (error) {
    return next(error);
  }
}

export async function getCustomerByAccountNumber(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { accountNumber } = req.body;

  try {
    const account = await AccountRepository.getOneBy({ accountNumber }) as any;
    if (!account) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: 'Customer account with account number provided does not exist',
      });
    }

    return ResponseHandler.sendSuccessResponse({
      res,
      data: { customer: account.customerId.name },
    });
  } catch (error) {
    return next(error);
  }
}