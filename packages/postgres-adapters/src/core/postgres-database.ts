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
    console.log('Constructed');
    this.currentIndex = index++;
  }

  public async connection() {
    return this.pool.get();
  }

  public transaction() {
    console.log(`tx unit`, index);
    if (!this._transaction) {
      throw new Error('No transaction started');
    }
    return this._transaction;
  }

  public async begin(): Promise<void> {
    console.log(`begin unit`, index);
    if (this._transaction) {
      throw new Error(`Transaction already started`);
    }

    const connection = await this.pool.get();

    this._transaction = await connection.startTransaction().execute();
  }

  public async commit(): Promise<void> {
    console.log(`commit unit`, index);
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
