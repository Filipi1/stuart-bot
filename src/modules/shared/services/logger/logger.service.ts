/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, ConsoleLogger, Scope, LogLevel } from '@nestjs/common';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class LoggerService extends ConsoleLogger {
  constructor() {
    super();

    const logLevels: LogLevel[] =
      process.env.NODE_ENV === 'development'
        ? ['log', 'debug', 'error', 'verbose', 'warn']
        : ['log', 'error', 'warn', 'verbose'];

    this.setLogLevels(logLevels);
  }

  log(message: any): void {
    super.log.apply(this, [message]);
  }

  error(message: any, stack?: string, context?: string): void {
    super.error.apply(this, [message, stack, context]);
  }

  warn(message: any): void {
    super.warn.apply(this, [message]);
  }

  debug(message: any): void {
    super.debug.apply(this, [message]);
  }

  verbose(message: any): void {
    super.verbose.apply(this, [message]);
  }
}
