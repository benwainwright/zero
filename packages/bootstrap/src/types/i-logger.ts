export interface ILogger {
  child<TContext extends object>(context: TContext): ILogger;
  error<TData extends { context?: string; error: Error }>(
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
  silly<TData extends { context: string }>(message: string, data?: TData): void;
}
