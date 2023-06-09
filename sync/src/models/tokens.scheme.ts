import { Schema, model } from "mongoose";

export interface IToken {
  token: string;
}

export const customerSchema = new Schema<IToken>({
  token: String,
});

export const TokenModel = model<IToken>("Token", customerSchema, 'tokens');
