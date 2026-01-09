import { type Kysely } from 'kysely';

export const up = async (db: Kysely<unknown>) => {
  await db.schema
    .createTable('roles')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey().notNull().unique())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('permissions', 'text', (col) => col.notNull().defaultTo('[]'))
    .addColumn('routes', 'text', (col) => col.notNull().defaultTo('[]'))
    .execute();

  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey().notNull().unique())
    .addColumn('email', 'text', (col) => col.notNull().unique())
    .addColumn('passwordHash', 'text', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('user_roles')
    .ifNotExists()
    .addColumn('userId', 'text', (col) => col.notNull())
    .addColumn('roleId', 'text', (col) => col.notNull())
    .addPrimaryKeyConstraint('user_roles_pkey', ['roleId', 'userId'])

    .addForeignKeyConstraint(
      'user_roles_user_fk',
      ['userId'],
      'users',
      ['id'],
      (con) => con.onDelete('cascade')
    )
    .addForeignKeyConstraint(
      'user_roles_role_fk',
      ['roleId'],
      'roles',
      ['id'],
      (con) => con.onDelete('cascade')
    )
    .execute();

  await db.schema
    .createIndex('user_roles_user_id_idx')
    .ifNotExists()
    .on('user_roles')
    .column('userId')
    .execute();

  await db.schema
    .createIndex('user_roles_role_id_idx')
    .ifNotExists()
    .on('user_roles')
    .column('roleId')
    .execute();
};

export const down = async (db: Kysely<unknown>) => {
  await db.schema.dropTable('user_roles').ifExists().execute();
  await db.schema.dropTable('users').ifExists().execute();
  await db.schema.dropTable('roles').ifExists().execute();
};
