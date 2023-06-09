"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerModel = void 0;
const mongoose_1 = require("mongoose");
const customerSchema = new mongoose_1.Schema({
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
exports.CustomerModel = (0, mongoose_1.model)("Customer", customerSchema, 'customers');
//# sourceMappingURL=index.js.map