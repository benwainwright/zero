import type { IUnitOfWork } from '@zero/application-core';
import type { PostgresConnectionPool } from './postgress-connection-pool.ts';
import { inject } from './typed-inject.ts';
import type { ControlledTransaction } from 'kysely';
import type { Database } from './i-database.ts';
import { injectable, postConstruct } from 'inversify';

@injectable()
export class PostgressDatabase implements IUnitOfWork {
  private _transaction: ControlledTransaction<Database, []> | undefined;

  public constructor(
    @inject('PostgresConnectionPool')
    private pool: PostgresConnectionPool
  ) {}

  @postConstruct()
  private async create(): Promise<void> {
    this.pool.get();
  }

  public async transaction() {
    if (!this._transaction) {
      this._transaction = await this.pool.get().startTransaction().execute();
    }
    return this._transaction;
  }

  public async begin(): Promise<void> {
    // NOOP
  }

  public async commit(): Promise<void> {
    await (await this.transaction()).commit().execute();
  }

  public async rollback(): Promise<void> {
    await (await this.transaction()).rollback().execute();
  }
}
