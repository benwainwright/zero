import type { Kysely } from 'kysely';

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable('oauth_tokens')
    .addColumn('expiry', 'timestamp', (col) => col.notNull())
    .addColumn('id', 'text', (col) => col.notNull().unique())
    .addColumn('token', 'text')
    .addColumn('refreshToken', 'text')
    .addColumn('provider', 'text', (col) => col.notNull())
    .addColumn('ownerId', 'text', (col) => col.notNull())
    .addColumn('refreshExpiry', 'timestamp')
    .addColumn('lastUse', 'timestamp')
    .addColumn('refreshed', 'timestamp')
    .addColumn('created', 'timestamp', (col) => col.notNull())
    .addPrimaryKeyConstraint('oauth_tokens_pkey', ['provider', 'ownerId'])
    .addForeignKeyConstraint(
      'accounts_owner_id_pkey',
      ['ownerId'],
      'users',
      ['id'],
      (con) => con.onDelete('cascade')
    )
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable('oauth_tokens').ifExists().cascade().execute();
};
