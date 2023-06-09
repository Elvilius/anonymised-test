import { AnonymizeCustomerService } from './anonymize-customer.service';
import { CustomerAnonymisedModel } from './models/customers-anonymised.scheme';
import { CustomerModel } from './models/customers.scheme';
import { TokenModel } from './models/tokens.scheme';

const INTERVAL = 1000;
const BATCH_SIZE = 1000;

class Sync {
  private readonly AnonymizeCustomerService: typeof AnonymizeCustomerService;
  private readonly CustomerModel: typeof CustomerModel;
  private readonly CustomerAnonymisedModel: typeof CustomerAnonymisedModel;
  private readonly TokenModel: typeof TokenModel;
  private lastToken = null;
  private customerAnonymiseDocs = [];
  private timer: string | number | NodeJS.Timer;

  constructor() {
    this.CustomerModel = CustomerModel;
    this.CustomerAnonymisedModel = CustomerAnonymisedModel;
    this.TokenModel = TokenModel;
    this.AnonymizeCustomerService = AnonymizeCustomerService;
  }

  async start() {
    this.syncInsert();
    this.syncUpdate();
    this.syncDelete();
    this.timer = setInterval(() => this.saveBatch(), INTERVAL);
  }

  private async syncInsert() {
    this.lastToken = await this.getLastToken();
    const resumeAfterToken = this.lastToken ? { _data: this.lastToken } : undefined;
    this.CustomerModel.watch([{ $match: { operationType: 'insert' } }], { resumeAfter: resumeAfterToken }).on('change', async data => {
      try {
        this.setState(data._id._data);
        const customerAnonymised = this.AnonymizeCustomerService.anonymize(data.fullDocument);
        this.customerAnonymiseDocs.push({ data: customerAnonymised, token: this.lastToken });
        if (this.customerAnonymiseDocs.length >= BATCH_SIZE) {
          await this.saveBatch();
        }
      } catch (e) {
        await this.stop();
        console.error(e);
        process.exit(1);
      }
    });
  }

  async syncUpdate() {
    this.CustomerModel.watch([{ $match: { operationType: 'update' } }], {}).on('change', async data => {
      try {
        const _id = data.documentKey._id;
        const updateCustomer = this.AnonymizeCustomerService.anonymize(data.updateDescription.updatedFields);
        await this.CustomerAnonymisedModel.updateOne({ _id }, updateCustomer);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    });
  }

  private syncDelete() {
    this.CustomerModel.watch([{ $match: { operationType: 'delete' } }], {}).on('change', async data => {
      try {
        await CustomerAnonymisedModel.deleteOne({ _id: data.documentKey._id });
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    });
  }

  private async saveBatch() {
    if (this.customerAnonymiseDocs.length) {
      const firstToken = this.customerAnonymiseDocs[0].token;
      const lastToken = this.customerAnonymiseDocs.slice(-1)[0].token;

      this.setState(firstToken);
      await this.CustomerAnonymisedModel.insertMany(this.customerAnonymiseDocs.map(({ data }) => data));
      this.customerAnonymiseDocs = [];
      this.setState(lastToken);
    }
  }

  private async getLastToken() {
    const token = await this.TokenModel.findOne().sort({ _id: -1 }).lean();
    return token?.token;
  }

  setState(token: string) {
    this.lastToken = token;
  }

  async stop() {
    await this.saveState();
    clearInterval(this.timer);
  }

  async saveState() {
    await this.TokenModel.updateOne({}, { token: this.lastToken }, { upsert: true });
  }

  async reindex() {
    let bulkData = [];
    const data = this.findByChunk();
    for await (const customers of data) {
      for (const customer of customers) {
        const anonymizeCustomer = this.AnonymizeCustomerService.anonymize(customer.toObject());
        bulkData.push({
          updateMany: {
            filter: { _id: anonymizeCustomer._id },
            update: anonymizeCustomer,
            upsert: true,
          },
        });
      }
      await this.CustomerAnonymisedModel.bulkWrite(bulkData);
      bulkData = [];
    }
    return;
  }

  private async *findByChunk() {
    let skip = 0;
    while (true) {
      const objects = await this.CustomerModel.find().limit(BATCH_SIZE).skip(skip).sort({ _id: 1 });
      if (!objects.length) break;

      yield objects;

      skip += BATCH_SIZE;
    }
  }
}

export const SyncService = new Sync();
