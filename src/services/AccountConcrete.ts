import { db } from '../util/mongo';
import { logger } from '../util/logger';
import { Account } from './Account';
import { DefaultResponseType } from '../types';
import { AccountValidationType } from '../types/account';
import { ACCOUNT_OPERATIONS } from '../constants/account';
import { TRANSACTION_CATEGORIES } from '../constants/transaction';
import * as AccountHelper from '../helpers/account';
import * as TransactionHelper from '../helpers/transaction';
import AccountRepository from '../repositories/AccountRepository';
import TransactionRepository from '../repositories/TransactionRepository';

class AccountConcrete implements Account {
  public async getBalances(accountNumber: string): Promise<DefaultResponseType> {
    const response: AccountValidationType = await AccountHelper.validateAccountOperation(
      accountNumber,
      ACCOUNT_OPERATIONS.BALANCE,
    );
    if (!response.status) {
      return {
        status: false,
        error: response.error,
      };
    }

    return {
      status: true,
      data: {
        lienBalance: response.account!.lienBalance,
        availableBalance: response.account!.availableBalance,
        totalBalance: response.account!.totalBalance,
      },
    };
  }

  public async deposit(
    accountNumber: string, 
    amount: number,
    customerName?: string,
  ): Promise<DefaultResponseType> {
    const session = await db.startSession();

    await session.withTransaction(async () => {
      const response: AccountValidationType = await AccountHelper.validateAccountOperation(
        accountNumber,
        ACCOUNT_OPERATIONS.INFLOW,
        amount,
      );
      if (!response.status) throw response.error;

      const previousBalance = response.account!.availableBalance;
  
      // Update account balance
      await AccountRepository.update({
        account: response.account!,
        availableBalance: response.account!.availableBalance + amount,
        totalBalance: response.account!.totalBalance + amount,
      });
  
      const transactionResponse: DefaultResponseType = await TransactionHelper.setTransaction({
        amount,
        transactionCategory: TRANSACTION_CATEGORIES.CREDIT,
        isDeposit: true,
        account: (!customerName) ? response.account : undefined,
        customerName,
      });
  
      // Set credit transaction
      await TransactionRepository.create({
        accountId: response.account!._id,
        category: TRANSACTION_CATEGORIES.CREDIT,
        reference: transactionResponse.data.reference,
        narration: transactionResponse.data.narration,
        amount,
        otherDetails: {
          depositedByCustomer: (customerName) ? false : true,
          otcDeposit: (customerName) ? true : false,
          previousBalance,
          newBalance: response.account!.availableBalance + amount,
        },
      });
    })
    .catch((err) => {
      logger.error(err);

      return {
        status: false,
        error: err,
      };
    });

    return { status: true };
  }

  public async transferFunds(
    sourceAccount: string, 
    destinationAccount: string, 
    amount: number,
  ): Promise<DefaultResponseType> {
    const session = await db.startSession();

    await session.withTransaction(async () => {
      // Validate source account
      const sourceResponse: AccountValidationType = await AccountHelper.validateAccountOperation(
        sourceAccount,
        ACCOUNT_OPERATIONS.OUTFLOW,
        amount,
      );
      if (!sourceResponse.status) throw sourceResponse.error;

      // Validate destination account
      const destinationResponse: AccountValidationType = await AccountHelper.validateAccountOperation(
        destinationAccount,
        ACCOUNT_OPERATIONS.INFLOW,
        amount,
      );
      if (!destinationResponse.status) throw destinationResponse.error;

      const sourcePreviousBalance = sourceResponse.account!.availableBalance;
      const destinationPreviousBalance = destinationResponse.account!.totalBalance;

      // <======== Debit source account
      
      await AccountRepository.update({
        account: sourceResponse.account!,
        availableBalance: sourceResponse.account!.availableBalance - amount,
        totalBalance: sourceResponse.account!.totalBalance - amount,
      });

      const sourceTransactionResponse: DefaultResponseType = await TransactionHelper.setTransaction({
        amount,
        transactionCategory: TRANSACTION_CATEGORIES.DEBIT,
        isDeposit: false,
        account: destinationResponse.account!,
      });

      // Set debit transaction
      await TransactionRepository.create({
        accountId: sourceResponse.account!._id,
        category: TRANSACTION_CATEGORIES.DEBIT,
        reference: sourceTransactionResponse.data.reference,
        narration: sourceTransactionResponse.data.narration,
        amount,
        otherDetails: {
          depositedByCustomer: false,
          otcDeposit: false,
          destinationAccount: destinationResponse.account!.accountNumber,
          previousBalance: sourcePreviousBalance,
          newBalance: sourcePreviousBalance - amount,
        },
      });

      // ==============>

      // <======== Credit destination account
      
      await AccountRepository.update({
        account: destinationResponse.account!,
        availableBalance: destinationResponse.account!.availableBalance + amount,
        totalBalance: destinationResponse.account!.totalBalance + amount,
      });

      const destinationTransactionResponse: DefaultResponseType = await TransactionHelper.setTransaction({
        amount,
        transactionCategory: TRANSACTION_CATEGORIES.CREDIT,
        isDeposit: false,
        account: sourceResponse.account!,
      });

      // Set debit transaction
      await TransactionRepository.create({
        accountId: destinationResponse.account!._id,
        category: TRANSACTION_CATEGORIES.CREDIT,
        reference: destinationTransactionResponse.data.reference,
        narration: destinationTransactionResponse.data.narration,
        amount,
        otherDetails: {
          depositedByCustomer: false,
          otcDeposit: false,
          sourceAccount: sourceResponse.account!.accountNumber,
          previousBalance: destinationPreviousBalance,
          newBalance: destinationPreviousBalance + amount,
        },
      });

      // =================>
    })
    .catch((err) => {
      logger.error(err);
      
      return {
        status: false,
        error: err,
      };
    });

    return { status: true };
  }
}

export default new AccountConcrete();