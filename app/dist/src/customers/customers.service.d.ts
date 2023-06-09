import { CustomerModel } from "./models";
import { CreateCustomerDto } from "./dto/create-customer.dto";
declare class Customers {
    CustomerModel: typeof CustomerModel;
    constructor();
    create(createCustomersDto: CreateCustomerDto[]): Promise<void>;
}
export declare const CustomersService: Customers;
export {};
