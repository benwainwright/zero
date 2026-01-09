import type { Kysely } from 'kysely';

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable('accounts')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey().notNull().unique())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) => col.notNull())
    .addColumn('closed', 'text', (col) => col.notNull())
    .addColumn('balance', 'integer', (col) => col.notNull())
    .addColumn('deleted', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('ownerId', 'text', (col) => col.notNull())

    .addForeignKeyConstraint(
      'accounts_owner_id_pkey',
      ['ownerId'],
      'users',
      ['id'],
      (con) => con.onDelete('cascade')
    )
    .execute();

  await db.schema
    .createIndex('accounts_user_id_idx')
    .ifNotExists()
    .on('accounts')
    .column('ownerId')
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable('accounts').ifExists().execute();
};
