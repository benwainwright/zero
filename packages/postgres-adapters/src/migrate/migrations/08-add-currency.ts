import type { Kysely } from 'kysely';

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable('transactions')
    .addColumn('currency', 'text')
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable('transactions').dropColumn('currency').execute();
};
