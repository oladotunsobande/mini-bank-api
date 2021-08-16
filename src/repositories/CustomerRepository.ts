import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { Customer } from '../models';
import { ICustomer } from '../models/customer';
import { 
  CreateCustomerInterface,
  CustomerQueryParameters,
} from '../types/customer';
import { SALT_ROUNDS } from '../constants/customer';

class CustomerRepository {
  public async create({
    id,
    name,
    email,
    password,
  }: CreateCustomerInterface): Promise<ICustomer> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = new Customer({
      id,
      name,
      email,
      password: hashedPassword,
    });

    return customer.save();
  }

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