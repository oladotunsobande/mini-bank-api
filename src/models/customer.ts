import { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  id: number;
  name: string;
}

export const CustomerSchema = new Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
    },
    name: { type: String, required: true },
  },
  { timestamps: true },
);

CustomerSchema.index({ id: 1 }, { unique: true });