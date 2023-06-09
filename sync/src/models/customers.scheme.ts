import { Schema, model } from "mongoose";

export interface ICustomer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    postcode: string;
    city: string;
    state: string;
    country: string;
  };
  createdAt: Date;
}

export const customerSchema = new Schema<ICustomer>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    line1: String,
    line2: String,
    postcode: String,
    city: String,
    state: String,
    country: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export const CustomerModel = model<ICustomer>("Customer", customerSchema, 'customers');
