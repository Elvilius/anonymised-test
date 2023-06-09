"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnonymizeCustomerService = void 0;
const crypto = require("crypto");
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var ANONYMIZE_FIELDS;
(function (ANONYMIZE_FIELDS) {
    ANONYMIZE_FIELDS["firstName"] = "firstName";
    ANONYMIZE_FIELDS["lastName"] = "lastName";
    ANONYMIZE_FIELDS["line1"] = "line1";
    ANONYMIZE_FIELDS["line2"] = "line2";
    ANONYMIZE_FIELDS["postcode"] = "postcode";
    ANONYMIZE_FIELDS["address"] = "address";
    ANONYMIZE_FIELDS["email"] = "email";
})(ANONYMIZE_FIELDS || (ANONYMIZE_FIELDS = {}));
class AnonymizeCustomer {
    anonymize(data) {
        if (!data)
            return null;
        const updateFieldSet = new Set([ANONYMIZE_FIELDS.firstName, ANONYMIZE_FIELDS.lastName, ANONYMIZE_FIELDS.line1, ANONYMIZE_FIELDS.line2, ANONYMIZE_FIELDS.postcode]);
        const anonymizeData = Object.entries(data).reduce((acc, [key, value]) => {
            const keys = key.split('.');
            if (keys[0] === ANONYMIZE_FIELDS.address || key === ANONYMIZE_FIELDS.address) {
                if (value.constructor === Object) {
                    return Object.assign(Object.assign({}, acc), { address: Object.assign(Object.assign({}, (acc.address && {})), this.anonymize(value)) });
                }
                const [, secondKey] = keys;
                if (!updateFieldSet.has(secondKey)) {
                    return acc;
                }
                return Object.assign(Object.assign({}, acc), { address: Object.assign(Object.assign({}, acc.address), { [secondKey]: this.getDataAnonymize(value) }) });
            }
            if (key === ANONYMIZE_FIELDS.email) {
                const [email, domain] = data.email;
                const anonymizeEmail = [this.getDataAnonymize(email), domain].join('@');
                acc[key] = anonymizeEmail;
                return acc;
            }
            if (!updateFieldSet.has(key)) {
                return acc;
            }
            const anonymizeField = this.getDataAnonymize(value);
            acc[key] = anonymizeField;
            return acc;
        }, {});
        const dataAddress = data.address;
        const anonymizeAddress = anonymizeData.address;
        const { _id, createdAt } = data;
        return Object.assign(Object.assign(Object.assign(Object.assign({}, (_id && { _id })), (createdAt && { createdAt })), anonymizeData), (anonymizeAddress ? { address: Object.assign(Object.assign({}, dataAddress), anonymizeAddress) } : {}));
    }
    getDataAnonymize(data) {
        const hash = crypto.createHash('sha256', { encoding: 'utf8' });
        hash.update(data);
        const hashValue = hash.digest('hex');
        let result = '';
        for (let i = 0, j = 0; i < 8;) {
            const byte = parseInt(hashValue.substr(j, 2), 16);
            if (byte < 200) {
                result += CHARS.charAt(byte % CHARS.length);
                i++;
            }
            j += 2;
        }
        return result;
    }
}
exports.AnonymizeCustomerService = new AnonymizeCustomer();
//# sourceMappingURL=anonymize-customer.service.js.map