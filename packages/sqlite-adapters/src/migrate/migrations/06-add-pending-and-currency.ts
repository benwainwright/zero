import type { Kysely } from 'kysely';

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable('transactions')
    .addColumn('pending', 'text', (oc) => oc.notNull())
    .execute();

  await db.schema
    .alterTable('transactions')
    .addColumn('currency', 'text', (ob) => ob.notNull())
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable('transactions').dropColumn('pending').execute();
  await db.schema.alterTable('transactions').dropColumn('currency').execute();
};
