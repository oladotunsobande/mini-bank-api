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
    status,
  }: CreateAccountInterface): Promise<IAccount> {
    const account = new Account({
      customerId,
      category,
      accountNumber,
      bvn,
      openedAt: new Date(),
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
    closedAt,
    status,
  }: UpdateAcccountInterface): Promise<IAccount> {
    if (bvn) account.bvn = bvn;
    if (lienBalance != undefined) account.lienBalance = lienBalance;
    if (availableBalance != undefined) account.availableBalance = availableBalance;
    if (totalBalance != undefined) account.totalBalance = totalBalance;
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