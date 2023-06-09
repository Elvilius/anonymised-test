"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyncService = void 0;
const anonymize_customer_service_1 = require("./anonymize-customer.service");
const customers_anonymised_scheme_1 = require("./models/customers-anonymised.scheme");
const customers_scheme_1 = require("./models/customers.scheme");
const tokens_scheme_1 = require("./models/tokens.scheme");
const INTERVAL = 1000;
const BATCH_SIZE = 1000;
class Sync {
    constructor() {
        this.lastToken = null;
        this.customerAnonymiseDocs = [];
        this.CustomerModel = customers_scheme_1.CustomerModel;
        this.CustomerAnonymisedModel = customers_anonymised_scheme_1.CustomerAnonymisedModel;
        this.TokenModel = tokens_scheme_1.TokenModel;
        this.AnonymizeCustomerService = anonymize_customer_service_1.AnonymizeCustomerService;
    }
    async start() {
        this.syncInsert();
        this.syncUpdate();
        this.syncDelete();
        this.timer = setInterval(() => this.saveBatch(), INTERVAL);
    }
    async syncInsert() {
        this.lastToken = await this.getLastToken();
        const resumeAfterToken = this.lastToken ? { _data: this.lastToken } : undefined;
        this.CustomerModel.watch([{ $match: { operationType: 'insert' } }], { resumeAfter: resumeAfterToken }).on('change', async (data) => {
            try {
                this.setState(data._id._data);
                const customerAnonymised = this.AnonymizeCustomerService.anonymize(data.fullDocument);
                this.customerAnonymiseDocs.push({ data: customerAnonymised, token: this.lastToken });
                if (this.customerAnonymiseDocs.length >= BATCH_SIZE) {
                    await this.saveBatch();
                }
            }
            catch (e) {
                await this.stop();
                console.error(e);
                process.exit(1);
            }
        });
    }
    async syncUpdate() {
        this.CustomerModel.watch([{ $match: { operationType: 'update' } }], {}).on('change', async (data) => {
            try {
                const _id = data.documentKey._id;
                const updateCustomer = this.AnonymizeCustomerService.anonymize(data.updateDescription.updatedFields);
                await this.CustomerAnonymisedModel.updateOne({ _id }, updateCustomer);
            }
            catch (e) {
                console.error(e);
                process.exit(1);
            }
        });
    }
    syncDelete() {
        this.CustomerModel.watch([{ $match: { operationType: 'delete' } }], {}).on('change', async (data) => {
            try {
                await customers_anonymised_scheme_1.CustomerAnonymisedModel.deleteOne({ _id: data.documentKey._id });
            }
            catch (e) {
                console.error(e);
                process.exit(1);
            }
        });
    }
    async saveBatch() {
        if (this.customerAnonymiseDocs.length) {
            const firstToken = this.customerAnonymiseDocs[0].token;
            const lastToken = this.customerAnonymiseDocs.slice(-1)[0].token;
            this.setState(firstToken);
            await this.CustomerAnonymisedModel.insertMany(this.customerAnonymiseDocs.map(({ data }) => data));
            this.customerAnonymiseDocs = [];
            this.setState(lastToken);
        }
    }
    async getLastToken() {
        const token = await this.TokenModel.findOne().sort({ _id: -1 }).lean();
        return token === null || token === void 0 ? void 0 : token.token;
    }
    setState(token) {
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
        var _a, e_1, _b, _c;
        let bulkData = [];
        const data = this.findByChunk();
        try {
            for (var _d = true, data_1 = __asyncValues(data), data_1_1; data_1_1 = await data_1.next(), _a = data_1_1.done, !_a;) {
                _c = data_1_1.value;
                _d = false;
                try {
                    const customers = _c;
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
                finally {
                    _d = true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = data_1.return)) await _b.call(data_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return;
    }
    findByChunk() {
        return __asyncGenerator(this, arguments, function* findByChunk_1() {
            let skip = 0;
            while (true) {
                const objects = yield __await(this.CustomerModel.find().limit(BATCH_SIZE).skip(skip).sort({ _id: 1 }));
                if (!objects.length)
                    break;
                yield yield __await(objects);
                skip += BATCH_SIZE;
            }
        });
    }
}
exports.SyncService = new Sync();
//# sourceMappingURL=sync.service.js.map