import type { Kysely } from 'kysely';

export const up = async (db: Kysely<unknown>) => {
  db.schema
    .alterTable('categories')
    .alterColumn('ownerId', (col) => col.setNotNull())
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  db.schema
    .alterTable('categories')
    .alterColumn('ownerId', (col) => col.dropNotNull())
    .execute();
};
