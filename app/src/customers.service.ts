import { CustomerModel } from './models';
import { CreateCustomerDto } from './dto/create-customer.dto';

class Customers {
  private readonly CustomerModel: typeof CustomerModel;

  constructor() {
    this.CustomerModel = CustomerModel;
  }
  async create(createCustomersDto: CreateCustomerDto[]) {
    await this.CustomerModel.insertMany(createCustomersDto);
  }
}

export const CustomersService = new Customers();
