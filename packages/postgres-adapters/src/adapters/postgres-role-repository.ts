import type { IRoleRepository } from '@zero/auth';
import { Role, permissionSchema, routesSchema } from '@zero/domain';
import { inject, json } from '@core';
import z from 'zod';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { DB, Roles } from '../core/database.ts';
import type { Selectable } from 'kysely';

export interface RawRole {
  id: string;
  name: string;
  permissions: string;
  routes: string;
}

export class PostgresRoleRepository implements IRoleRepository {
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {}

  public async requireRole(id: string): Promise<Role> {
    const role = await this.getRole(id);

    if (!role) {
      throw new Error(`Role '${id}' was not found`);
    }
    return role;
  }

  private mapRaw(role: Selectable<Roles>) {
    return Role.reconstitute({
      ...role,
      permissions: z.array(permissionSchema).parse(role.permissions),
      routes: routesSchema.parse(role.routes),
    });
  }

  public async getRole(id: string): Promise<Role | undefined> {
    console.log('beforetx');
    const tx = this.database.transaction();

    console.log('select');
    const result = await tx
      .selectFrom('roles')
      .where('id', '=', id)
      .selectAll()
      .executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return this.mapRaw(result);
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

    return result.map((role) => this.mapRaw(role));
  }
}
