import { sql, type Kysely } from 'kysely';

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable('bank_connections')
    .addColumn('id', 'text', (col) => col.notNull().unique())
    .addColumn('logo', 'text')
    .addColumn('requisitionId', 'text')
    .addColumn('ownerId', 'text')
    .addColumn('accounts', 'jsonb', (col) =>
      col.notNull().defaultTo(sql`'[]'::jsonb`)
    )
    .addForeignKeyConstraint(
      'bank_connections_owner_id_pkey',
      ['ownerId'],
      'users',
      ['id'],
      (con) => con.onDelete('cascade')
    )
    .execute();

  await db.schema
    .createTable('categories')
    .addColumn('id', 'text', (col) => col.primaryKey())
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
    .addColumn('id', 'text')
    .addColumn('accountId', 'text')
    .addColumn('date', 'datetime', (col) => col.notNull())
    .addColumn('date', 'datetime')
    .addColumn('ownerId', 'text')
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
  await db.schema.dropTable('categories').ifExists().cascade().execute();
  await db.schema.dropTable('bank_connections').ifExists().cascade().execute();
  await db.schema.dropTable('transactions').ifExists().cascade().execute();
};
