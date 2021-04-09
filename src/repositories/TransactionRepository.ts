import { Transaction } from '../models';
import { ITransaction } from '../models/transaction';
import {
  CreateTransactionInterface,
  TransactionQueryParameters,
} from '../types/transaction';

class TransactionRepository {
  public async create({
    accountId,
    category,
    reference,
    narration,
    amount,
    otherDetails,
  }: CreateTransactionInterface): Promise<ITransaction> {
    const transaction = new Transaction({
      accountId,
      category,
      reference,
      narration,
      amount,
      otherDetails,
    });

    return transaction.save();
  }

  public async getOneBy(
    query: TransactionQueryParameters,
    leanVersion: boolean = true,
  ): Promise<ITransaction | null> {
    return Transaction.findOne(query).lean(leanVersion);
  }

  public async getAllBy(
    query: TransactionQueryParameters,
    skip: number = 0,
    limit: number = 20,
    leanVersion: boolean = true,
  ): Promise<ITransaction[]> {
    return Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean(leanVersion);
  }

  public async countBy(query: TransactionQueryParameters): Promise<number> {
    return Transaction.countDocuments(query);
  }
}

export default new TransactionRepository();