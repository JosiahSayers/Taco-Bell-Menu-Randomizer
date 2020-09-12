import { LogStatementInterface, LogStatement } from '../types/log-statement.model';

function info(message: string, json?: object): void {
  sendLogToDatabase(message || '', json || {}, 'info');
}

function error(message: string, json?: object): void {
  sendLogToDatabase(message || '', json || {}, 'error');
}

function sendLogToDatabase(message: string, json: object, level: string): void {
  LogStatement.create({
    time: new Date().toISOString(),
    message,
    stringifiedLog: JSON.stringify(json),
    level
  });
}

export const Logger = {
  info,
  error
};
