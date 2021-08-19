import jwt from 'jsonwebtoken';
import { ExpressRequest } from '../util/express';
import { Response, NextFunction } from 'express';
import { ResponseType } from '../types';
import ResponseHandler from '../util/response-handler';
import { TOKEN_SECRET } from '../config/env';
import { setRetryAfterTimeText } from '../helpers';
import { getCustomerId } from '../helpers/customer';
import { getAccountNumber } from '../helpers/account';
import { ACCOUNT_STATUSES, ACCOUNT_CATEGORIES } from '../constants/account';
import AccountRepository from '../repositories/AccountRepository';
import CustomerRepository from '../repositories/CustomerRepository';
import { MAX_FAILED_LOGINS_PER_USER } from '../constants/security';
import { consecutiveLoginFails } from '../middlewares/rateLimit';

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

export async function login(
  req: ExpressRequest,
  res: Response,
  next: NextFunction,
): Promise<ResponseType> {
  const { email, password } = req.body;

  try {
    const userRateLimit = await consecutiveLoginFails.get(email);

    if (userRateLimit && userRateLimit.consumedPoints > MAX_FAILED_LOGINS_PER_USER) {
      const retrySecs = Math.round(userRateLimit.msBeforeNext / 1000) || 1;

      res.set('Retry-After', String(retrySecs));

      return ResponseHandler.sendErrorResponse({
        res,
        status: 429,
        error: `Too many requests. Please retry after ${setRetryAfterTimeText(retrySecs)}`,
      });
    }

    const customer = await CustomerRepository.getOneBy({ email }, false);
    if (!customer || !(await customer.comparePassword(password))) {
      try {
        await consecutiveLoginFails.consume(email);

        return ResponseHandler.sendErrorResponse({
          res,
          error: 'Invalid email/password',
        });
      } catch (err) {
        if (err instanceof Error) throw err;
        
        const retrySeconds = Math.round(err.msBeforeNext / 1000) || 1;

        res.set('Retry-After', String(retrySeconds));

        return ResponseHandler.sendErrorResponse({
          res,
          status: 429,
          error: `Too many requests. Please retry after ${setRetryAfterTimeText(retrySeconds)}`,
        });
      }
    }

    if (userRateLimit && userRateLimit.consumedPoints > 0) {
      await consecutiveLoginFails.delete(email);
    }

    const token = jwt.sign(
      { id: customer.id },
      TOKEN_SECRET,
      { expiresIn: '2h' },
    );

    return ResponseHandler.sendSuccessResponse({
      res,
      message: 'Login successful',
      data: { token },
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
  const { accountNumber } = req.query;

  try {
    const account = await AccountRepository.getOneBy({ accountNumber: accountNumber as string }) as any;
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