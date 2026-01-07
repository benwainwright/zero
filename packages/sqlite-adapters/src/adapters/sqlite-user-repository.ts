import type { IUserRepository } from '@zero/auth';
import { Role, User, permissionSchema } from '@zero/domain';
import { inject, SqliteDatabase } from '@core';
import z from 'zod';
import type { RawRole } from './sqlite-role-repository.ts';

interface RawUser {
  id: string;
  passwordHash: string;
  email: string;
  roles: string;
}

export class SqliteUserRepository implements IUserRepository {
  public constructor(
    @inject('SqliteDatabase')
    private readonly database: SqliteDatabase
  ) {}

  public async requireUser(id: string): Promise<User> {
    const user = await this.getUser(id);

    if (!user) {
      throw new Error(`User '${id}' was not found!`);
    }

    return user;
  }

  public mapRawRole(raw: RawRole) {
    return Role.reconstitute({
      ...raw,
      permissions: z.array(permissionSchema).parse(JSON.parse(raw.permissions)),
      routes: JSON.parse(raw.routes),
    });
  }

  private mapRawUser(raw: RawUser) {
    const rawRoles = JSON.parse(raw.roles) as RawRole[];
    return User.reconstitute({
      ...raw,
      roles: rawRoles.map((role) => this.mapRawRole(role).toObject()),
    });
  }

  public async saveUser(user: User): Promise<User> {
    const joinTable = await this.database.getJoinTableName(`users`, `roles`);
    const usersTable = await this.database.getTableName(`users`);

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
      FROM ${await this.database.getJoinTableName('users', 'roles')} user_roles
      JOIN ${await this.database.getTableName('roles')} roles
        ON roles.id = user_roles.roleId
    ),
    '[]'
  ) as roles
  FROM ${await this.database.getTableName('users')} users`;
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
      `DELETE FROM ${await this.database.getTableName('users')}
      WHERE id = ?`,
      [user.id]
    );
  }
}
