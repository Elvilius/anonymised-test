/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Schema } from "mongoose";
export interface ICustomer {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    address: {
        line1: string;
        line2: string;
        postcode: string;
        city: string;
        state: string;
        country: string;
    };
    createdAt: Date;
}
export declare const customerSchema: Schema<ICustomer, import("mongoose").Model<ICustomer, any, any, any, import("mongoose").Document<unknown, any, ICustomer> & Omit<ICustomer & Required<{
    _id: string;
}>, never>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ICustomer, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ICustomer>> & Omit<import("mongoose").FlatRecord<ICustomer> & Required<{
    _id: string;
}>, never>>;
export declare const CustomerModel: import("mongoose").Model<ICustomer, {}, {}, {}, import("mongoose").Document<unknown, {}, ICustomer> & Omit<ICustomer & Required<{
    _id: string;
}>, never>, any>;
