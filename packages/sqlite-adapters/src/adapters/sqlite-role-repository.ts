import type { IRoleRepository } from '@zero/auth';
import { Role, permissionSchema, routesSchema } from '@zero/domain';

import { inject, type DB } from '@core';
import z from 'zod';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { Selectable } from 'kysely';
import type { Roles } from '../core/database.ts';
import type { IWriteRepository } from '@zero/application-core';
import { BaseRepo } from './base-repo.ts';

export class SqliteRoleRepository
  extends BaseRepo<Role, [string]>
  implements IRoleRepository, IWriteRepository<Role>
{
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {
    super();
  }

  public async update(role: Role): Promise<Role> {
    const tx = this.database.transaction();
    await tx
      .updateTable('roles')
      .set(this.mapValues(role))
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
      permissions: z
        .array(permissionSchema)
        .parse(JSON.parse(role.permissions)),
      routes: routesSchema.parse(JSON.parse(role.routes)),
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

  public mapRawRole(raw: Selectable<Roles>) {
    return Role.reconstitute({
      ...raw,
      permissions: z.array(permissionSchema).parse(JSON.parse(raw.permissions)),
      routes: JSON.parse(raw.routes),
    });
  }

  private mapValues(role: Role) {
    const values = role.toObject();
    return {
      ...values,
      permissions: JSON.stringify(values.permissions),
      routes: JSON.stringify(values.routes),
    };
  }

  public async save(role: Role): Promise<Role> {
    const tx = this.database.transaction();
    await tx.insertInto('roles').values(this.mapValues(role)).execute();
    return role;
  }

  public async list({
    start,
    limit,
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
