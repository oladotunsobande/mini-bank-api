import { Types } from 'mongoose';

export interface CreateCustomerInterface {
  id: number;
  name: string;
};

export type CustomerQueryParameters = {
  _id?: Types.ObjectId;
  id?: number;
}