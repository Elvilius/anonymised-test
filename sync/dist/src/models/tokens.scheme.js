"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenModel = exports.customerSchema = void 0;
const mongoose_1 = require("mongoose");
exports.customerSchema = new mongoose_1.Schema({
    token: String,
});
exports.TokenModel = (0, mongoose_1.model)("Token", exports.customerSchema, 'tokens');
//# sourceMappingURL=tokens.scheme.js.map