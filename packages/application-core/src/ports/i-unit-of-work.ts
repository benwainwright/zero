export interface IUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  atomically<T = unknown>(callback: () => Promise<T>): Promise<T>;
}
