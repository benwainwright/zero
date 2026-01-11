export interface IUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  executeAtomically<T = unknown>(callback: () => Promise<T>): Promise<T>;
}
