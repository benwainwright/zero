import type { IUnitOfWork } from '@zero/application-core';
import type { ConfigValue } from '@zero/bootstrap';

import BetterSqlite3 from 'better-sqlite3';
import { injectable, postConstruct } from 'inversify';
import { inject } from './typed-inject.ts';

type TableName = 'users' | 'roles';

type StoredQuery = {
  sql: string;
  params: unknown[];
};

@injectable()
export class SqliteDatabase implements IUnitOfWork {
  private database: InstanceType<typeof BetterSqlite3> | undefined;
  private storedQueries: StoredQuery[] = [];

  public constructor(
    @inject('DatabaseFilename')
    private readonly databaseName: ConfigValue<string>,

    @inject('DatabaseTablePrefix')
    private readonly tablePrefix: ConfigValue<string>
  ) {}

  public async begin(): Promise<void> {
    // NOOP - all handled by the bettersqlite3 transaction function
  }

  public async getTableName(table: TableName): Promise<string> {
    return `${await this.tablePrefix.value}_${table}`;
  }

  public async getJoinTableName(first: TableName, second: TableName) {
    return `${await this.getTableName(first)}_${await this.getTableName(
      second
    )}`;
  }

  public async commit(): Promise<void> {
    const db = await this.getDatabase();
    try {
      this.runQuerySync(db, 'BEGIN TRANSACTION;');
      let query: StoredQuery | undefined;

      do {
        query = this.storedQueries.shift();
        if (query) {
          this.runQuerySync(db, query.sql, ...query.params);
        }
      } while (typeof query !== 'undefined');
      this.runQuerySync(db, 'COMMIT TRANSACTION;');
    } catch (error) {
      this.runQuerySync(db, 'ROLLBACK TRANSACTION;');
      throw error;
    } finally {
      this.storedQueries = [];
    }
  }

  public async rollback(): Promise<void> {
    this.storedQueries = [];
  }

  private async getDatabase(): Promise<InstanceType<typeof BetterSqlite3>> {
    if (!this.database) {
      this.database = new BetterSqlite3(await this.databaseName.value);
    }

    return this.database;
  }

  // oxlint-disable eslint/require-await
  public deferQueryToTransaction(sql: string, ...params: unknown[]) {
    this.storedQueries.push({
      sql,
      params,
    });
  }

  private runQuerySync(
    database: InstanceType<typeof BetterSqlite3>,
    sql: string,
    ...params: unknown[]
  ) {
    const prepared = database.prepare(sql);
    prepared.run(...params);
  }

  public async runQuery(sql: string, ...params: unknown[]) {
    const db = await this.getDatabase();

    this.runQuerySync(db, sql, ...params);
  }

  public async getFromDb<TResponse>(sql: string, ...params: unknown[]) {
    const db = await this.getDatabase();
    console.log(sql);
    const prepared = db.prepare(sql);
    return prepared.get(...params) as TResponse;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async getAllFromDatabase<TResponse extends any[]>(
    sql: string,
    ...params: unknown[]
  ) {
    const db = await this.getDatabase();
    const prepared = db.prepare(sql);
    return prepared.all(...params) as TResponse;
  }
}
