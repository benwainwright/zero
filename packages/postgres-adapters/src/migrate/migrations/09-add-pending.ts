import type { Kysely } from 'kysely';

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable('transactions')
    .addColumn('pending', 'boolean', (oc) => oc.notNull().defaultTo(false))
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable('transactions').dropColumn('pending').execute();
};
