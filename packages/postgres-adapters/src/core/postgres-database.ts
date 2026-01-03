import type { IUnitOfWork } from '@zero/application-core';
import type { PostgresConnectionPool } from './postgress-connection-pool.ts';
import { inject } from './typed-inject.ts';
import type { ControlledTransaction } from 'kysely';
import type { Database } from './i-database.ts';
import { injectable } from 'inversify';

let index = 0;

@injectable()
export class PostgressDatabase implements IUnitOfWork {
  private _transaction: ControlledTransaction<Database, []> | undefined;
  public readonly currentIndex: number;

  public constructor(
    @inject('PostgresConnectionPool')
    private pool: PostgresConnectionPool
  ) {
    this.currentIndex = index++;
    console.log('constructing');
  }

  public async connection() {
    return this.pool.get();
  }

  public transaction() {
    if (!this._transaction) {
      throw new Error('No transaction started');
    }
    return this._transaction;
  }

  public async begin(): Promise<void> {
    console.log('begin tx', this.currentIndex);
    if (!this._transaction) {
      console.log('creating now');
      this._transaction = await this.pool.get().startTransaction().execute();
    } else {
      console.log('old one');
    }
  }

  public async commit(): Promise<void> {
    const tx = this.transaction();
    if (tx) {
      this._transaction = undefined;
      await tx.commit().execute();
    }
  }

  public async rollback(): Promise<void> {
    const tx = this.transaction();
    if (tx) {
      this._transaction = undefined;
      await tx.rollback().execute();
    }
  }
}
