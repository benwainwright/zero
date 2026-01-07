import type { IRoleRepository } from '@zero/auth';
import { Role, permissionSchema } from '@zero/domain';
import { inject, json, PostgressDatabase } from '@core';
import z from 'zod';

export interface RawRole {
  id: string;
  name: string;
  permissions: string;
  routes: string;
}

export class PostgresRoleRepository implements IRoleRepository {
  public constructor(
    @inject('PostgresDatabase')
    private readonly database: PostgressDatabase
  ) {}

  public async requireRole(id: string): Promise<Role> {
    const role = await this.getRole(id);

    if (!role) {
      throw new Error(`Role '${id}' was not found`);
    }
    return role;
  }

  public async getRole(id: string): Promise<Role | undefined> {
    const tx = await this.database.connection();

    const result = await tx
      .selectFrom('roles')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return Role.reconstitute(result);
  }

  public mapRawRole(raw: RawRole) {
    return Role.reconstitute({
      ...raw,
      permissions: z.array(permissionSchema).parse(JSON.parse(raw.permissions)),
      routes: JSON.parse(raw.routes),
    });
  }

  public async saveRole(role: Role): Promise<Role> {
    const tx = this.database.transaction();

    await tx
      .insertInto('roles')
      .values({
        ...role.toObject(),
        permissions: json(role.toObject().permissions),
        routes: json(role.toObject().routes),
      })
      .onConflict((oc) =>
        oc.column('id').doUpdateSet((eb) => ({
          name: eb.ref('excluded.name'),
          permissions: eb.ref('excluded.permissions'),
          routes: eb.ref('excluded.routes'),
        }))
      )
      .execute();
    return role;
  }

  public async getManyRoles(offset: number, limit: number): Promise<Role[]> {
    const tx = this.database.transaction();
    const result = await tx
      .selectFrom('roles')
      .selectAll()
      .offset(offset)
      .limit(limit)
      .execute();

    return result.map((role) => Role.reconstitute(role));
  }
}
