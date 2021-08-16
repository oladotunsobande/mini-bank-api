import { Types } from 'mongoose';

export interface CreateCustomerInterface {
  id?: number;
  name: string;
  email: string;
  password: string;
}

export type CustomerQueryParameters = {
  _id?: Types.ObjectId;
  id?: number;
  email?: string;
  accountNumber?: string;
};