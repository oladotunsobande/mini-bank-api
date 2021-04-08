import rs from 'randomstring';
import numeral from 'numeral';
import { IAccount } from '../models/account';
import { TRANSACTION_CATEGORIES } from '../constants/transaction';
import { DefaultResponseType } from '../types';
import CustomerRepository from '../repositories/CustomerRepository';
import TransactionRepository from '../repositories/TransactionRepository';

function formatMoney(amount: number): string {
  const new_amount: string = (amount / 100).toFixed(2);
  return numeral(new_amount).format('0,0.00');
}

export async function getReference(): Promise<string> {
  const reference: string = rs.generate({
    charset: 'alphanumeric',
    length: 15,
  });

  const transaction = await TransactionRepository.getOneBy({ reference });
  if (transaction) await getReference();

  return reference;
}

export function getNarration(
  {
    reference,
    amount,
    transactionCategory,
    isDeposit,
    sender,
    receiver,
  }: {
    reference: string,
    amount: number,
    transactionCategory: string,
    isDeposit: boolean;
    sender?: string,
    receiver?: string,
  }
): string {
  let suffix: string = `deposited by ${sender}`;

  if (!isDeposit && transactionCategory === TRANSACTION_CATEGORIES.CREDIT && sender) {
    suffix = `transferred from ${sender}`;
  } else if (!isDeposit && transactionCategory === TRANSACTION_CATEGORIES.DEBIT && receiver) {
    suffix = `transferred to ${receiver}`;
  }
    
  return `Ref: ${reference} - NGN${formatMoney(amount)} ${suffix}`;
}

export async function setTransaction({
  amount,
  transactionCategory,
  isDeposit,
  account,
  customerName,
}: {
  amount: number;
  transactionCategory: string;
  isDeposit: boolean;
  account?: IAccount;
  customerName?: string;
}): Promise<DefaultResponseType> {
  const reference: string = await getReference();

  if (account && !customerName) {
    const customer = await CustomerRepository.getOne(account.customerId);
    if (!customer) {
      return {
        status: false,
        error: 'Customer record does not exist',
      };
    }

    customerName = customer.name;
  }

  const narration: string = getNarration({
    reference,
    amount,
    transactionCategory,
    isDeposit,
    sender: (isDeposit || (!isDeposit && transactionCategory === TRANSACTION_CATEGORIES.CREDIT)) ? customerName : undefined,
    receiver: (!isDeposit && transactionCategory === TRANSACTION_CATEGORIES.DEBIT) ? customerName : undefined,
  });

  return {
    status: true,
    data: {
      reference,
      narration,
    },
  };
}