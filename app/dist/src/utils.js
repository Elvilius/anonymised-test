"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomCustomers = void 0;
const faker_1 = require("@faker-js/faker");
const util_1 = require("util");
const getRandomArbitrary = () => Math.random() * (10 - 1) + 1;
const getRandomCustomer = () => {
    const sex = faker_1.faker.person.sexType();
    const firstName = faker_1.faker.person.firstName(sex);
    const lastName = faker_1.faker.person.lastName();
    const email = faker_1.faker.internet.email({
        firstName,
        lastName,
    });
    return {
        email,
        firstName,
        lastName,
        address: {
            line1: faker_1.faker.location.streetAddress(),
            line2: faker_1.faker.location.secondaryAddress(),
            postcode: faker_1.faker.location.countryCode(),
            city: faker_1.faker.location.city(),
            state: faker_1.faker.location.state(),
            country: faker_1.faker.location.country(),
        },
    };
};
const getRandomCustomers = async () => {
    await (0, util_1.promisify)(setTimeout)(1000);
    return Array.from({
        length: getRandomArbitrary(),
    }).map(() => getRandomCustomer());
};
exports.getRandomCustomers = getRandomCustomers;
//# sourceMappingURL=utils.js.map