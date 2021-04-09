import { Types } from 'mongoose';

export interface OtherDetailsInterface {
  depositedByCustomer: boolean;
  otcDeposit: boolean,
  sourceAccount?: string;
  destinationAccount?: string;
  previousBalance: number;
  newBalance: number;
}

export interface CreateTransactionInterface {
  accountId: Types.ObjectId;
  category: string;
  reference: string;
  narration: string;
  amount: number;
  otherDetails?: any;
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