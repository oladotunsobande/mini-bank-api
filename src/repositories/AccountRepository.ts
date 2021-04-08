import { Account } from '../models';
import { IAccount } from '../models/account';
import {
  CreateAccountInterface,
  UpdateAcccountInterface,
  AccountQueryParameters,
} from '../types/account';

class AccountRepository {
  public async create({
    customerId,
    category,
    accountNumber,
    bvn,
    initialDeposit,
    status,
  }: CreateAccountInterface): Promise<IAccount> {
    const account = new Account({
      customerId,
      category,
      accountNumber,
      bvn,
      availableBalance: initialDeposit,
      totalBalance: initialDeposit,
      status,
    });

    return account.save();
  }

  public async update({
    account,
    bvn,
    lienBalance,
    availableBalance,
    totalBalance,
    openedAt,
    closedAt,
    status,
  }: UpdateAcccountInterface): Promise<IAccount> {
    if (bvn) account.bvn = bvn;
    if (lienBalance) account.lienBalance = lienBalance;
    if (availableBalance) account.availableBalance = availableBalance;
    if (totalBalance) account.totalBalance = totalBalance;
    if (openedAt) account.openedAt = openedAt;
    if (closedAt) account.closedAt = closedAt;
    if (status) account.status = status;

    return account.save();
  }

  public async getOneBy(
    query: AccountQueryParameters,
    leanVersion: boolean = true,
  ): Promise<IAccount | null> {
    return Account.findOne(query).lean(leanVersion);
  }
}

export default new AccountRepository();