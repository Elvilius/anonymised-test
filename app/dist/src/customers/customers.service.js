"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomersService = void 0;
const models_1 = require("./models");
class Customers {
    constructor() {
        this.CustomerModel = models_1.CustomerModel;
    }
    async create(createCustomersDto) {
        await this.CustomerModel.insertMany(createCustomersDto);
    }
}
exports.CustomersService = new Customers();
//# sourceMappingURL=customers.service.js.map