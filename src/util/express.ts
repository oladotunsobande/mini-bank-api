import { Request } from 'express';
import { ICustomer } from '../models/customer';

export interface ExpressRequest extends Request {
  customer?: ICustomer;
}
