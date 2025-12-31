import type { IRoleRepository, IUserRepository } from '@zero/auth';
import { Role, User, permissionSchema } from '@zero/domain';
import { inject, SqliteDatabase } from '@core';
import type { ConfigValue } from '@zero/bootstrap';
import { postConstruct } from 'inversify';
import z from 'zod';

interface RawUser {
  id: string;
  passwordHash: string;
  email: string;
  roles: string;
}

interface RawRole {
  id: string;
  name: string;
  permissions: string;
  routes: string;
}

type TableName = 'users' | 'roles';

export class SqliteRepositoryAdapter
  implements IUserRepository, IRoleRepository
{
  public constructor(
    @inject('SqliteDatabase')
    private readonly database: SqliteDatabase,

    @inject('DatabaseTablePrefix')
    private readonly tablePrefix: ConfigValue<string>
  ) {}

  public async requireUser(id: string): Promise<User> {
    const user = await this.getUser(id);

    if (!user) {
      throw new Error(`User 'id' was not found!`);
    }

    return user;
  }

  public async getRole(id: string): Promise<Role | undefined> {
    const result = await this.database.getFromDb<RawRole | undefined>(
      `SELECT id, name, permissions, routes
        FROM ${await this.getTableName('roles')}
        where id = ?`,
      [id]
    );

    if (!result) {
      return undefined;
    }

    return this.mapRawRole(result);
  }

  public mapRawRole(raw: RawRole) {
    return Role.reconstitute({
      ...raw,
      permissions: z.array(permissionSchema).parse(JSON.parse(raw.permissions)),
      routes: JSON.parse(raw.routes),
    });
  }

  public async saveRole(role: Role): Promise<Role> {
    const roleTable = await this.getTableName('roles');

    this.database.deferQueryToTransaction(
      `INSERT INTO ${roleTable} (id, name, permissions, routes)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          permissions = excluded.permissions,
          routes = excluded.routes
          `,
      [
        role.id,
        role.name,
        JSON.stringify(role.permissions),
        JSON.stringify(role.routes),
      ]
    );

    return role;
  }

  public async getManyRoles(offset: number, limit: number): Promise<Role[]> {
    const result = await this.database.getAllFromDatabase<RawRole[]>(
      `SELECT id, name, permissions, routes
        FROM ${await this.getTableName('roles')}
        LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return result.map((raw) => this.mapRawRole(raw));
  }

  private async getTableName(table: TableName): Promise<string> {
    return `${await this.tablePrefix.value}_${table}`;
  }

  private async getJoinTableName(first: TableName, second: TableName) {
    return `${await this.getTableName(first)}_${await this.getTableName(
      second
    )}`;
  }

  @postConstruct()
  public async create() {
    await this.database
      .runQuery(`CREATE TABLE IF NOT EXISTS ${await this.getTableName(
      'users'
    )} (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL UNIQUE,
          passwordHash TEXT NOT NULL
      );`);

    await this.database.runQuery(
      `CREATE TABLE IF NOT EXISTS ${await this.getJoinTableName(
        'users',
        'roles'
      )} (
        userId TEXT NOT NULL,
        roleId TEXT NOT NULL,
        PRIMARY KEY (userId, roleId),
        FOREIGN KEY (userId) references ${await this.getTableName('users')}(id),
        FOREIGN KEY (roleId) references ${await this.getTableName('roles')}(id)
      );`
    );

    await this.database
      .runQuery(`CREATE TABLE IF NOT EXISTS ${await this.getTableName(
      'roles'
    )} (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          permissions TEXT NOT NULL,
          routes TEXT NOT NULL
      );`);

    await this.database.runQuery(
      `CREATE INDEX IF NOT EXISTS idx_users_roles_roleId ON ${await this.getJoinTableName(
        'users',
        'roles'
      )}(roleId);`
    );
    await this.database.runQuery(
      `CREATE INDEX IF NOT EXISTS idx_users_roles_userId ON ${await this.getJoinTableName(
        'users',
        'roles'
      )}(userId);`
    );
  }

  private mapRawUser(raw: RawUser) {
    const rawRoles = JSON.parse(raw.roles) as RawRole[];
    return User.reconstitute({
      ...raw,
      roles: rawRoles.map((role) => this.mapRawRole(role).toObject()),
    });
  }

  public async saveUser(user: User): Promise<User> {
    const joinTable = await this.getJoinTableName(`users`, `roles`);
    const usersTable = await this.getTableName(`users`);

    this.database.deferQueryToTransaction(
      `INSERT INTO ${usersTable} (id, email, passwordHash)
        VALUES (?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          email    = excluded.email,
          passwordHash    = excluded.passwordHash`,
      [user.id, user.email, user.passwordHash]
    );

    this.database.deferQueryToTransaction(
      `DELETE FROM ${joinTable}
      WHERE userId = ?`,
      [user.id]
    );

    user.roles.forEach((role) =>
      this.database.deferQueryToTransaction(
        `INSERT INTO ${joinTable} (userId, roleId)
      VALUES (?, ?)`,
        [user.id, role.id]
      )
    );

    return user;
  }

  private async getUserQuery() {
    return `SELECT users.id, users.email, users.passwordHash,
    COALESCE(
    (
      SELECT json_group_array(
        json_object(
          'id', roles.id,
          'name', roles.name,
          'permissions', roles.permissions,
          'routes', roles.routes
        )
      )
      FROM ${await this.getJoinTableName('users', 'roles')} user_roles
      JOIN ${await this.getTableName('roles')} roles
        ON roles.id = user_roles.roleId
    ),
    '[]'
  ) as roles
  FROM ${await this.getTableName('users')} users`;
  }

  public async getUser(id: string): Promise<User | undefined> {
    const result = await this.database.getFromDb<RawUser | undefined>(
      `${await this.getUserQuery()}
      WHERE users.id = ?
    `,
      [id]
    );

    if (!result) {
      return undefined;
    }

    return this.mapRawUser(result);
  }
  public async getManyUsers(start?: number, limit?: number): Promise<User[]> {
    const result = await this.database.getAllFromDatabase<RawUser[]>(
      `${await this.getUserQuery()}
      LIMIT ? OFFSET ?`,
      [limit ?? 30, start ?? 0]
    );

    return result.map((raw) => this.mapRawUser(raw));
  }
  public async deleteUser(user: User): Promise<void> {
    this.database.deferQueryToTransaction(
      `DELETE FROM ${await this.getTableName('users')}
      WHERE id = ?`,
      [user.id]
    );
  }
}
