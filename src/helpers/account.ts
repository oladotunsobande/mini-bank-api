import { AccountValidationType } from '../types/account';
import { ACCOUNT_STATUSES, ACCOUNT_OPERATIONS } from '../constants/account';
import AccountRepository from '../repositories/AccountRepository';

export async function validateAccountOperation(
  accountNumber: string,
  operation: string,
  amount?: number,
): Promise<AccountValidationType> {
  const leanVersion: boolean = (operation === ACCOUNT_OPERATIONS.BALANCE) ? true : false;

  const account = await AccountRepository.getOneBy({ accountNumber }, leanVersion);
  if (!account) {
    return {
      status: false,
      error: 'Account does not exist',
    };
  }

  if (account.status === ACCOUNT_STATUSES.INACTIVE) {
    return {
      status: false,
      error: 'Account is inactive',
    };
  }

  if (operation === ACCOUNT_OPERATIONS.INFLOW && amount && amount <= 0) {
    return {
      status: false,
      error: 'Deposit amount must be greater than zero',
    };
  }

  if (operation === ACCOUNT_OPERATIONS.OUTFLOW && amount && amount > account.availableBalance) {
    return {
      status: false,
      error: 'Insufficient balance',
    };
  }

  return {
    status: true,
    account,
  };
}