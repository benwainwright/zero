import type { Kysely } from 'kysely';

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .alterTable('accounts')
    .addColumn('description', 'text')
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.alterTable('accounts').dropColumn('description').execute();
};
