"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const customers_service_1 = require("./src/customers/customers.service");
const utils_1 = require("./src/utils");
require("dotenv/config");
const start = async () => {
    try {
        await mongoose_1.default.connect(process.env.DB_URI);
        const c = await (0, utils_1.getRandomCustomers)();
        await customers_service_1.CustomersService.create(c);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
start();
//# sourceMappingURL=main.js.map