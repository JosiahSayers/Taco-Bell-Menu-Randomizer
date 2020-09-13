import mongoose from 'mongoose';

export type LogStatementDocument = mongoose.Document & LogStatementInterface;

export interface LogStatementInterface {
  time: string;
  message: string;
  json: object;
  level: string;
}

const logStatementSchema = new mongoose.Schema({
  time: String,
  message: { type: String, text: true },
  json: Object,
  level: String
});

export const LogStatement = mongoose.model<LogStatementDocument>('logging', logStatementSchema);