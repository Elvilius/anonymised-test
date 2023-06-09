import mongoose from "mongoose";
import { CustomersService } from "./src/customers.service";
import { getRandomCustomers } from "./src/utils";
import "dotenv/config";

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);

    while (true) {
      const customers = await getRandomCustomers();
      await CustomersService.create(customers);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
