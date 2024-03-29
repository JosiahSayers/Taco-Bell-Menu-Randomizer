import { LogStatement } from '../types/log-statement.model';

const runningTimers: { [timerName: string]: { startTime: number } } = {};
const logToConsole = () => process.env.LOG_TO_CONSOLE === 'true';

function info(message: string, hostname: string, json?: object): void {
  sendLogToDatabase(message || '', json || {}, 'info', hostname);
}

function error(message: string, hostname: string, json?: object): void {
  sendLogToDatabase(message || '', json || {}, 'error', hostname);
}

function startTimerFor(timerName: string): void {
  runningTimers[timerName] = { startTime: new Date().getTime() };
  sendLogToDatabase(`Timer started for ${timerName}`, {}, 'info');
}

function finishTimerFor(timerName: string): void {
  const timer = runningTimers[timerName];
  if (timer) {
    const endTime = new Date().getTime();
    const lengthOfTimerMS = endTime - timer.startTime;
    const lengthInMinutes = Math.floor(lengthOfTimerMS / 60000);
    const lengthInSeconds = parseInt(((lengthOfTimerMS % 60000) / 1000).toFixed(0));

    sendLogToDatabase(
      `Timer completed for ${timerName}`,
      {
        timerName,
        startTime: new Date(timer.startTime).toUTCString(),
        endTime: new Date(endTime).toUTCString(),
        lengthMS: lengthOfTimerMS,
        length: `${lengthInMinutes} minute${lengthInMinutes > 1 ? 's' : ''}, ${lengthInSeconds} second${lengthInSeconds > 1 ? 's' : ''}`
      },
      'info');

    delete runningTimers[timerName];
  }
}

function sendLogToDatabase(message: string, json: object, level: string, hostname?: string): void {
  const logStatement = {
    message,
    json,
    level,
    hostname
  };

  if (process.env.NODE_ENV === 'production') {
    LogStatement.create(logStatement);
  }
  
  if (logToConsole()) {
    console.log(logStatement);
  }
}

export const Logger = {
  info,
  error,
  startTimerFor,
  finishTimerFor
};
