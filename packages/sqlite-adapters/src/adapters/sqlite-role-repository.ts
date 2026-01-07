import type { IRoleRepository } from '@zero/auth';
import { Role, permissionSchema } from '@zero/domain';
import { inject, SqliteDatabase } from '@core';
import z from 'zod';

export interface RawRole {
  id: string;
  name: string;
  permissions: string;
  routes: string;
}

export class SqliteRoleRepository implements IRoleRepository {
  public constructor(
    @inject('SqliteDatabase')
    private readonly database: SqliteDatabase
  ) {}

  public async requireRole(id: string): Promise<Role> {
    const role = await this.getRole(id);

    if (!role) {
      throw new Error(`Role '${id}' was not found`);
    }
    return role;
  }

  public async getRole(id: string): Promise<Role | undefined> {
    const result = await this.database.getFromDb<RawRole | undefined>(
      `SELECT id, name, permissions, routes
        FROM ${await this.database.getTableName('roles')}
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
    const roleTable = await this.database.getTableName('roles');

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
        FROM ${await this.database.getTableName('roles')}
        LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return result.map((raw) => this.mapRawRole(raw));
  }
}
