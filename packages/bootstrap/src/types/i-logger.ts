export interface ILogger {
  child<TData extends { [name: string]: unknown }>(
    name: string,
    context?: TData
  ): ILogger;
  error<TData extends { context?: string; error?: Error | unknown }>(
    message: string,
    data?: TData
  ): void;
  warn<TData extends { context: string }>(message: string, data?: TData): void;
  info<TData extends { context: string }>(message: string, data?: TData): void;
  debug<TData extends { context: string }>(message: string, data?: TData): void;
  verbose<TData extends { context: string }>(
    message: string,
    data?: TData
  ): void;
  fatal<TData extends { context: string }>(message: string, data?: TData): void;
  silly<TData extends { context: string }>(message: string, data?: TData): void;
}
