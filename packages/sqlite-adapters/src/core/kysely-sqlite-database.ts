import type { ConfigValue } from '@zero/bootstrap';
import { inject, injectable } from 'inversify';
import type { IKyselyDataSource } from '@zero/kysely-shared';
import BetterSqlite3 from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import type { DB } from '@core';

@injectable()
export class KyselySqliteDatabase implements IKyselyDataSource<DB> {
  public constructor(
    @inject('DatabaseFilename')
    private readonly databaseName: ConfigValue<string>
  ) {
    console.log('CONSTRUCTING DB');
  }

  private connection: Kysely<DB> | undefined;
  private db: InstanceType<typeof BetterSqlite3> | undefined;

  public async get(): Promise<Kysely<DB>> {
    if (!this.connection) {
      this.db = new BetterSqlite3(await this.databaseName.value);
      this.db.pragma('busy_timeout = 1000');
      const dialect = new SqliteDialect({
        database: this.db,
      });

      this.connection = new Kysely<DB>({
        dialect,
      });
    }

    return this.connection;
  }

  public async close() {
    try {
      this.db?.close();
      await this.connection?.destroy();
    } catch {
      // NOOp
    } finally {
      this.db = undefined;
      this.connection = undefined;
    }
  }
}
