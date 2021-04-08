import { db } from '../util/mongo';
import { IAccount, AccountSchema } from './account';
import { ICustomer, CustomerSchema } from './customer';
import { ITransaction, TransactionSchema } from './transaction';

export const Account = db.model<IAccount>('Account', AccountSchema);
export const Customer = db.model<ICustomer>('Customer', CustomerSchema);
export const Transaction = db.model<ITransaction>('Transaction', TransactionSchema);