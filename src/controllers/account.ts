import { ExpressRequest } from '../util/express';
import { Response, NextFunction } from 'express';
import { ResponseType } from '../types';
import ResponseHandler from '../util/response-handler';
import { throwIfUndefined } from '../helpers';
import * as AccountHelper from '../helpers/account';
import {
  ACCOUNT_STATUSES,
  MAX_NUMBER_OF_CUSTOMER_ACCOUNTS,
} from '../constants/account';
import AccountRepository from '../repositories/AccountRepository';
import AccountConcrete from '../services/AccountConcrete';
import { DefaultResponseType } from '../types';

export async function create(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const {
    category,
    deposit,
    bvn,
  } = req.body;

  try {
    const customer = throwIfUndefined(req.customer, 'req.customer');

    const customerAccountCount = await AccountRepository.countBy({
      customerId: customer._id,
    });
    if (customerAccountCount === MAX_NUMBER_OF_CUSTOMER_ACCOUNTS) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: 'Sorry! You have reached the maximum number of accounts for a customer',
      });
    }

    const accountNumber = await AccountHelper.getAccountNumber();

    await AccountRepository.create({
      customerId: customer._id,
      category,
      accountNumber,
      bvn,
      status: ACCOUNT_STATUSES.ACTIVE,
    });

    if (deposit) {
      const response: DefaultResponseType = await AccountConcrete.deposit(accountNumber, deposit);
      if (!response.status) {
        return ResponseHandler.sendErrorResponse({
          res,
          error: response.error!,
        });
      }
    }

    return ResponseHandler.sendSuccessResponse({
      res,
      message: 'Account created successfully',
      data: { accountNumber },
    });
  } catch(error) {
    return next(error);
  }
}

export async function getBalances(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { accountNumber } = req.body;

  try {
    const customer = throwIfUndefined(req.customer, 'req.customer');

    const account = await AccountRepository.getOne({ accountNumber });
    if (!account) {
      return ResponseHandler.sendErrorResponse({
        res,
        status: 404,
        error: 'Account does not exist',
      });
    }

    if (String(account.customerId) !== String(customer._id)) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: 'Account provided does not belong to customer',
      });
    }

    const response: DefaultResponseType = await AccountConcrete.getBalances(accountNumber);
    if (!response.status) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: response.error!,
      });
    }

    return ResponseHandler.sendSuccessResponse({
      res,
      data: response.data,
    })
  } catch(error) {
    return next(error);
  }
}

export async function transfer(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const {
    sourceAccount,
    destinationAccount,
    amount,
    destinationAccountBelongsToCustomer,
  } = req.body;

  try {
    const customer = throwIfUndefined(req.customer, 'req.customer');

    // Validate source account
    const payerAccount = await AccountRepository.getOneBy({ accountNumber: sourceAccount }) as any;
    if (!payerAccount) {
      return ResponseHandler.sendErrorResponse({
        res,
        status: 404,
        error: 'Source account does not exist',
      });
    }

    if (String(payerAccount.customerId._id) !== String(customer._id)) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: 'Source account provided does not belong to customer',
      });
    }

    // Validate destination account
    const payeeAccount = await AccountRepository.getOneBy({ accountNumber: destinationAccount }) as any;
    if (!payeeAccount) {
      return ResponseHandler.sendErrorResponse({
        res,
        status: 404,
        error: 'Destination account does not exist',
      });
    }

    if (destinationAccountBelongsToCustomer && (String(payeeAccount.customerId._id) !== String(customer._id))) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: 'Destination account provided does not belong to customer',
      });
    }

    const response: DefaultResponseType = await AccountConcrete.transferFunds(
      sourceAccount,
      destinationAccount,
      amount,
    );
    if (!response.status) {
      return ResponseHandler.sendErrorResponse({
        res,
        error: response.error!,
      });
    }

    return ResponseHandler.sendSuccessResponse({
      res,
      message: 'Fund transferred successfully',
    });
  } catch(error) {
    return next(error);
  }
}