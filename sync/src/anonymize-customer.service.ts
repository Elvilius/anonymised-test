import * as crypto from 'crypto';
import { ICustomer } from './models/customers.scheme';

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

enum ANONYMIZE_FIELDS {
  firstName = 'firstName',
  lastName = 'lastName',
  line1 = 'line1',
  line2 = 'line2',
  postcode = 'postcode',
  address = 'address',
  email = 'email',
}

class AnonymizeCustomer {
  anonymize(data: ICustomer) {
    if (!data) return null;
    const updateFieldSet = new Set([ANONYMIZE_FIELDS.firstName, ANONYMIZE_FIELDS.lastName, ANONYMIZE_FIELDS.line1, ANONYMIZE_FIELDS.line2, ANONYMIZE_FIELDS.postcode] as string[]);
    const anonymizeData = Object.entries(data).reduce((acc, [key, value]) => {
      const keys = key.split('.');
      if (keys[0] === ANONYMIZE_FIELDS.address || key === ANONYMIZE_FIELDS.address) {
        if (value.constructor === Object) {
          return { ...acc, address: { ...(acc.address && {}), ...this.anonymize(value) } };
        }
        const [, secondKey] = keys;

        if (!updateFieldSet.has(secondKey)) {
          return acc;
        }
        return { ...acc, address: { ...acc.address, [secondKey]: this.getDataAnonymize(value) } };
      }

      if (key === ANONYMIZE_FIELDS.email) {
        const [email, domain] = data.email.split('@');
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
    }, {} as ICustomer);

    const dataAddress = data.address;
    const anonymizeAddress = anonymizeData.address;

    const { _id, createdAt } = data;
    return {
      ...(_id && { _id }),
      ...(createdAt && { createdAt }),
      ...anonymizeData,
      ...(anonymizeAddress ? { address: { ...dataAddress, ...anonymizeAddress } } : {}),
    };
  }

  private getDataAnonymize(data: string) {
    const hash = crypto.createHash('sha256', { encoding: 'utf8' });
    hash.update(data);
    const hashValue = hash.digest('hex');
    let result = '';
    for (let i = 0, j = 0; i < 8; ) {
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

export const AnonymizeCustomerService = new AnonymizeCustomer();
