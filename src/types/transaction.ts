import { Types } from 'mongoose';

export interface CreateTransactionInterface {
  accountId: Types.ObjectId;
  category: string;
  reference: string;
  narration: string;
  amount: number;
}

export type TransactionQueryParameters = {
  _id?: Types.ObjectId;
  accountId?: Types.ObjectId;
  reference?: string;
}

export type TransactionDetailsType = {
  reference: string;
  narration: string;
};