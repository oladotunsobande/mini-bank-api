import { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface ICustomer extends Document {
  id: number;
  name: string;
  email: string;
  comparePassword(password: string): boolean;
}

export const CustomerSchema = new Schema(
  {
    id: {
      type: Number,
      min: 1,
    },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

CustomerSchema.index(
  { id: 1, email: 1 }, 
  { unique: true },
);

CustomerSchema.methods.comparePassword = async function comparePassword(
  password: string,
) {
  return bcrypt.compare(password, this.password);
};