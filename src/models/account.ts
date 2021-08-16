import { Types, Schema, Document } from 'mongoose';
import { 
  ACCOUNT_CATEGORIES, 
  ACCOUNT_STATUSES, 
  ACCOUNT_NUMBER_MAX_LENGTH,
} from '../constants/account';

export interface IAccount extends Document {
  customerId: Types.ObjectId;
  category: string;
  accountNumber: string;
  bvn?: string;
  lienBalance: number;
  availableBalance: number;
  totalBalance: number;
  openedAt: Date;
  closedAt?: Date;
  status: string;
}

export const AccountSchema = new Schema(
  {
    customerId: {
      type: Types.ObjectId,
      required: true,
      ref: 'Customer',
    },
    category: {
      type: String,
      required: true,
      enum: Object.values(ACCOUNT_CATEGORIES),
    },
    accountNumber: {
      type: String,
      required: true,
      maxlength: ACCOUNT_NUMBER_MAX_LENGTH,
      unique: true,
    },
    bvn: {
      type: String,
      required: false,
      unique: true,
    },
    lienBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    availableBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    totalBalance: {
      type: Number,
      required: true,
      default: 0,
    },
    openedAt: { type: Date, required: true },
    closedAt: { type: Date, required: false },
    status: {
      type: String,
      enum: Object.values(ACCOUNT_STATUSES),
      default: ACCOUNT_STATUSES.INACTIVE,
    }
  },
  { timestamps: true },
);

AccountSchema.index(
  {
    customerId: 1,
    accountNumber: 1,
    bvn: 1,
  },
  { unique: false },
);