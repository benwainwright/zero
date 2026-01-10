export const up = async (db: Kysely<unknown>) => {};
export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable('categories').ifExists().execute();
};
