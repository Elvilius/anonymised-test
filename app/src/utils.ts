import { faker } from '@faker-js/faker';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { promisify } from 'util';

const getRandomArbitrary = () => Math.random() * (10 - 1) + 1;

const getRandomCustomer = (): CreateCustomerDto => {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const email = faker.internet.email({
    firstName,
    lastName,
  });

  return {
    email,
    firstName,
    lastName,
    address: {
      line1: faker.location.streetAddress(),
      line2: faker.location.secondaryAddress(),
      postcode: faker.location.countryCode(),
      city: faker.location.city(),
      state: faker.location.state(),
      country: faker.location.country(),
    },
  };
};

export const getRandomCustomers = async () => {
  await promisify(setTimeout)(1000);
  return Array.from({
    length: getRandomArbitrary(),
  }).map(() => getRandomCustomer());
};
