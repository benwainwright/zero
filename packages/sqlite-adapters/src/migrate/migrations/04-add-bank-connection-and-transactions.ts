import { type Kysely } from 'kysely';

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable('sync_details')
    .addColumn('id', 'text', (col) => col.primaryKey().notNull().unique())
    .addColumn('provider', 'text', (col) => col.notNull())
    .addColumn('lastSync', 'text')
    .addColumn('ownerId', 'text', (col) => col.notNull())
    .addColumn('checkpoint', 'text')
    .addForeignKeyConstraint(
      'sync_details_owner_pkye',
      ['ownerId'],
      'users',
      ['id'],
      (con) => con.onDelete('cascade')
    )
    .execute();

  await db.schema
    .createTable('bank_connections')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey().notNull().unique())
    .addColumn('logo', 'text', (col) => col.notNull())
    .addColumn('requisitionId', 'text')
    .addColumn('ownerId', 'text', (col) => col.notNull())
    .addColumn('bankName', 'text', (col) => col.notNull())
    .addColumn('accounts', 'text')
    .addForeignKeyConstraint(
      'bank_connections_owner_id_pkey',
      ['ownerId'],
      'users',
      ['id'],
      (con) => con.onDelete('cascade')
    )
    .execute();

  await db.schema
    .createIndex('bank_connection_owner_pkey')
    .ifNotExists()
    .on('bank_connections')
    .column('ownerId')
    .execute();

  await db.schema
    .createTable('categories')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('ownerId', 'text')
    .addForeignKeyConstraint(
      'category_owner_id_fkey',
      ['ownerId'],
      'users',
      ['id'],
      (con) => con.onDelete('cascade')
    )
    .execute();

  await db.schema
    .createTable('transactions')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey().notNull().unique())
    .addColumn('accountId', 'text', (col) => col.notNull())
    .addColumn('date', 'text', (col) => col.notNull())
    .addColumn('amount', 'integer', (col) => col.notNull())
    .addColumn('payee', 'text', (col) => col.notNull())
    .addColumn('ownerId', 'text', (col) => col.notNull())
    .addColumn('categoryId', 'text')
    .addForeignKeyConstraint(
      'transactions_owner_id_fkey',
      ['ownerId'],
      'users',
      ['id'],
      (con) => con.onDelete('cascade')
    )
    .addForeignKeyConstraint(
      'transactions_account_id_fkey',
      ['accountId'],
      'accounts',
      ['id'],
      (con) => con.onDelete('cascade')
    )
    .addForeignKeyConstraint(
      'transactions_category_id_fkey',
      ['categoryId'],
      'categories',
      ['id'],
      (con) => con.onDelete('set null')
    )
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable('sync_details').ifExists().execute();
  await db.schema.dropTable('categories').ifExists().execute();
  await db.schema.dropTable('bank_connections').ifExists().execute();
  await db.schema.dropTable('transactions').ifExists().execute();
};
