import { Role, permissionSchema, routesSchema } from '@zero/domain';
import { inject, json } from '@core';
import z from 'zod';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { DB, Roles } from '../core/database.ts';
import type { Selectable } from 'kysely';
import type { IWriteRepository } from '@zero/application-core';
import { BaseRepo } from './base-repo.ts';
import type { IRoleRepository } from '@zero/auth';

export interface RawRole {
  id: string;
  name: string;
  permissions: string;
  routes: string;
}

export class PostgresRoleRepository
  extends BaseRepo<Role, [string]>
  implements IWriteRepository<Role>, IRoleRepository
{
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {
    super();
  }

  private mapValues(role: Role) {
    const values = role.toObject();

    return {
      ...values,
      permissions: json(role.toObject().permissions),
      routes: json(role.toObject().routes),
    };
  }

  public async update(role: Role): Promise<Role> {
    const tx = this.database.transaction();
    await tx
      .updateTable('roles')
      .set(role.toObject())
      .where('id', '=', role.id)
      .execute();
    return role;
  }

  public async delete(role: Role): Promise<void> {
    const tx = this.database.transaction();

    await tx.deleteFrom('roles').where('id', '=', role.id).execute();
  }

  private mapRaw(role: Selectable<Roles>) {
    return Role.reconstitute({
      ...role,
      permissions: z.array(permissionSchema).parse(role.permissions),
      routes: routesSchema.parse(role.routes),
    });
  }

  public async get(id: string): Promise<Role | undefined> {
    const tx = this.database.transaction();

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

  public async save(role: Role): Promise<Role> {
    const tx = this.database.transaction();
    await tx.insertInto('roles').values(this.mapValues(role)).execute();
    return role;
  }

  public async list({
    limit,
    start,
  }: {
    start: number;
    limit: number;
  }): Promise<Role[]> {
    const tx = this.database.transaction();
    const result = await tx
      .selectFrom('roles')
      .selectAll()
      .offset(start)
      .limit(limit)
      .execute();

    return result.map((role) => this.mapRaw(role));
  }
}
