import { Types } from 'mongoose';
import { IAccount } from '../models/account';

export interface CreateAccountInterface {
  customerId: Types.ObjectId;
  category: string;
  accountNumber: string;
  bvn?: string;
  initialDeposit: number;
  status?: string;
}

export interface UpdateAcccountInterface {
  account: IAccount;
  bvn?: string;
  lienBalance?: number;
  availableBalance?: number;
  totalBalance?: number;
  openedAt?: Date;
  closedAt?: Date;
  status?: string;
}

export type AccountValidationType = {
  status: boolean;
  account?: IAccount;
  error?: string;
};

export type AccountQueryParameters = {
  _id?: Types.ObjectId;
  customerId?: Types.ObjectId;
  accountNumber?: string;
  bvn?: string;
}