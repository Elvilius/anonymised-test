"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerAnonymisedModel = void 0;
const mongoose_1 = require("mongoose");
const customers_scheme_1 = require("./customers.scheme");
exports.CustomerAnonymisedModel = (0, mongoose_1.model)("CustomerAnonymised", customers_scheme_1.customerSchema, 'customers_anonymised');
//# sourceMappingURL=customers-anonymised.scheme.js.map