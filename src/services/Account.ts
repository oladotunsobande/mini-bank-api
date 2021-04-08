import { DefaultResponseType } from '../types';

export interface Account {
  getBalances(accountNumber: string): Promise<DefaultResponseType>;
  deposit(
    accountNumber: string, 
    amount: number,
    customerName?: string,
  ): Promise<DefaultResponseType>;
  transferFunds(
    sourceAccount: string, 
    destinationAccount: string, 
    amount: number,
  ): Promise<DefaultResponseType>;
}