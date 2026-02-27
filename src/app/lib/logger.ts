/**
 * Simple logging utility with different log levels
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private level: LogLevel;
  private serviceName: string;

  constructor(serviceName: string = 'Wazivo', level: LogLevel = LogLevel.INFO) {
    this.serviceName = serviceName;
    this.level = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : level;
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (level < this.level) return;

    const timestamp = new Date().toISOString();
    const levelName = LogLevel[level];
    const prefix = `[${timestamp}] [${this.serviceName}] [${levelName}]`;

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(prefix, message, ...args);
        break;
      case LogLevel.INFO:
        console.log(prefix, message, ...args);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, ...args);
        break;
      case LogLevel.ERROR:
        console.error(prefix, message, ...args);
        
        // Send to monitoring service if available
        if (typeof window !== 'undefined' && (window as any).Sentry) {
          (window as any).Sentry.captureMessage(message, {
            level: 'error',
            extra: { args },
          });
        }
        break;
    }
  }

  debug(message: string, ...args: any[]) {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log(LogLevel.INFO, message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log(LogLevel.WARN, message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log(LogLevel.ERROR, message, ...args);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export factory for creating named loggers
export function createLogger(name: string): Logger {
  return new Logger(name);
}
