import { Schema, Document, Types } from 'mongoose';
import { TRANSACTION_CATEGORIES } from '../constants/transaction';
import { OtherDetailsInterface } from '../types/transaction';

export interface ITransaction extends Document {
  accountId: Types.ObjectId;
  category: string;
  reference: string;
  narration: string;
  amount: number;
  otherDetails?: OtherDetailsInterface;
}

const OtherDetailsSchema = new Schema({
  depositedByCustomer: Boolean,
  otcDeposit: Boolean,
  sourceAccount: String,
  destinationAccount: String,
  previousBalance: Number,
  newBalance: Number,
});

export const TransactionSchema = new Schema(
  {
    accountId: {
      type: Types.ObjectId,
      required: true,
      ref: 'Account',
    },
    category: { 
      type: String, 
      required: true,
      enum: Object.values(TRANSACTION_CATEGORIES),
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    narration: { type: String, required: true },
    amount: {
      type: Number,
      required: true,
    },
    otherDetails: { type: OtherDetailsSchema, required: false },
  },
  { timestamps: true },
);

TransactionSchema.index({ 
  accountId: 1,
  reference: 1,
});