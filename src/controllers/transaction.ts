import { ExpressRequest } from '../util/express';
import { Response, NextFunction } from 'express';
import { ResponseType } from '../types';
import ResponseHandler from '../util/response-handler';
import { throwIfUndefined } from '../helpers';
import AccountRepository from '../repositories/AccountRepository';
import TransactionRepository from '../repositories/TransactionRepository';

export async function getTransactions(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const {
    accountNumber,
    skip = 0,
    limit = 20,
  } = req.body;

  try {
    const customer = throwIfUndefined(req.customer, 'req.customer');

    const account = await AccountRepository.getOneBy({ accountNumber }) as any;
    if (!account) {
      return ResponseHandler.sendErrorResponse({
        res,
        status: 404,
        error: 'Account does not exist',
      });
    }

    if (String(account.customerId._id) !== String(customer._id)) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: 'Account provided does not belong to customer',
      });
    }

    const count = await TransactionRepository.countBy({ accountId: account._id });
    const transactions = await TransactionRepository.getAllBy(
      { accountId: account._id },
      skip,
      limit,
    );

    return ResponseHandler.sendSuccessResponse({
      res,
      data: { transactions, count },
    });
  } catch(error) {
    return next(error);
  }
}