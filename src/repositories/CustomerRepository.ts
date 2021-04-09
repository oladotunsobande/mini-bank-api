import { Types } from 'mongoose';
import { Customer } from '../models';
import { ICustomer } from '../models/customer';
import { 
  CreateCustomerInterface,
  CustomerQueryParameters,
} from '../types/customer';

class CustomerRepository {
  public async getOne(
    customerId: Types.ObjectId,
    leanVersion: boolean = true,
  ): Promise<ICustomer | null> {
    return Customer.findById(customerId).lean(leanVersion);
  }

  public async getOneBy(
    query: CustomerQueryParameters,
    leanVersion: boolean = true,
  ): Promise<ICustomer | null> {
    return Customer.findOne(query).lean(leanVersion);
  }

  public async createMany(documents: CreateCustomerInterface[]): Promise<ICustomer[]> {
    return Customer.insertMany(documents);
  }

  public async count(): Promise<number> {
    return Customer.countDocuments();
  }
}

export default new CustomerRepository();