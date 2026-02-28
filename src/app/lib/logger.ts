/**
 * Structured logging utility
 * In production, this should be replaced with Winston, Pino, or a logging service
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...context,
    };

    // In production, send to logging service (e.g., DataDog, LogRocket, Sentry)
    if (!this.isDevelopment) {
      // TODO: Implement production logging
      // this.sendToLoggingService(logData);
    }

    // Console output
    const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';

    switch (level) {
      case 'debug':
        if (this.isDevelopment) console.debug(formattedMessage + contextStr);
        break;
      case 'info':
        console.info(formattedMessage + contextStr);
        break;
      case 'warn':
        console.warn(formattedMessage + contextStr);
        break;
      case 'error':
        console.error(formattedMessage + contextStr);
        break;
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext) {
    this.log('error', message, context);
  }
}

export const logger = new Logger();
