import type { Kysely } from 'kysely';
import type { DB } from '../../core/database.ts';

export const up = async (db: Kysely<DB>) => {
  await db.deleteFrom('categories').where('ownerId', '=', null).execute();

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
