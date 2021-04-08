import { Types } from 'mongoose';
import { Customer } from '../models';
import { ICustomer } from '../models/customer';

class CustomerRepository {
  public async getOne(
    customerId: Types.ObjectId,
    leanVersion: boolean = true,
  ): Promise<ICustomer | null> {
    return Customer.findById(customerId).lean(leanVersion);
  }
}

export default new CustomerRepository();