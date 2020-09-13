import mongoose from 'mongoose';

export type LogStatementDocument = mongoose.Document & LogStatementInterface;

export interface LogStatementInterface {
  message: string;
  json: object;
  level: string;
  hostname: string;
}

const logStatementSchema = new mongoose.Schema({
  message: { type: String, text: true },
  json: Object,
  level: String,
  hostname: String
}, { timestamps: true });

export const LogStatement = mongoose.model<LogStatementDocument>('logging', logStatementSchema);