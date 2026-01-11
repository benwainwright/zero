import type { IUnitOfWork } from '@zero/application-core';
import { inject } from './typed-inject.ts';
import type { ControlledTransaction } from 'kysely';
import { injectable } from 'inversify';
import type { IKyselyDataSource } from './i-kysely-data-source.ts';
import type { IKyselyTransactionManager } from '@lib';

@injectable()
export class KyselyUnitOfWork<DB>
  implements IUnitOfWork, IKyselyTransactionManager<DB>
{
  private _transaction: ControlledTransaction<DB, []> | undefined;

  public constructor(
    @inject('KyselyDataSource')
    private database: IKyselyDataSource<DB>
  ) {}
  public async executeAtomically<T = unknown>(
    callback: () => Promise<T>
  ): Promise<T> {
    try {
      await this.begin();
      const returnVal = await callback();
      await this.commit();
      return returnVal;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  public async connection() {
    return this.database.get();
  }

  public transaction() {
    if (!this._transaction) {
      throw new Error('No transaction started');
    }
    return this._transaction;
  }

  public async begin(): Promise<void> {
    if (this._transaction) {
      throw new Error(`Transaction already started`);
    }

    const connection = await this.database.get();

    this._transaction = await connection.startTransaction().execute();
  }

  public async commit(): Promise<void> {
    try {
      const tx = this.transaction();
      if (tx) {
        await tx.commit().execute();
      }
    } finally {
      this._transaction = undefined;
    }
  }

  public async rollback(): Promise<void> {
    if (!this._transaction) return;
    try {
      await this._transaction.rollback().execute();
    } finally {
      this._transaction = undefined;
    }
  }
}
