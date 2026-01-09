export interface IUnitOfWork {
  begin(): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  executeAtomically(callback: () => Promise<void>): Promise<void>;
}
