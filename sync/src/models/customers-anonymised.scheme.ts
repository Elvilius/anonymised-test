import { model } from 'mongoose';
import { ICustomer, customerSchema } from './customers.scheme';

export const CustomerAnonymisedModel = model<ICustomer>('CustomerAnonymised', customerSchema, 'customers_anonymised');
