/**
 * Logger utility for consistent logging across the application
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  level?: LogLevel;
  serverOnly?: boolean;
}

class Logger {
  private isServer = typeof window === 'undefined';
  private isDevelopment = process.env.NODE_ENV === 'development';

  private shouldLog(options?: LogOptions): boolean {
    if (options?.serverOnly && !this.isServer) {
      return false;
    }
    return this.isDevelopment || this.isServer;
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.log(`ℹ️ ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.warn(`⚠️ ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.error(`❌ ${message}`, ...args);
    }
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog({ serverOnly: true })) {
      console.log(`🔍 ${message}`, ...args);
    }
  }

  success(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.log(`✅ ${message}`, ...args);
    }
  }
}

export const logger = new Logger();

