import {
  Role,
  User,
  permissionSchema,
  roleSchema,
  routesSchema,
} from '@zero/domain';
import { inject } from '@core';
import z from 'zod';
import { sql, type Selectable } from 'kysely';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { DB, Roles, Users } from '../core/database.ts';
import { BaseRepo } from './base-repo.ts';
import type { IUserRepository } from '@zero/auth';
import type { IWriteRepository } from '@zero/application-core';

export class PostgresUserRepository
  extends BaseRepo<User, [string]>
  implements IUserRepository, IWriteRepository<User>
{
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {
    super();
  }

  public async update(user: User): Promise<User> {
    const tx = this.database.transaction();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, roles, ...values } = user.toObject();

    await tx
      .updateTable('users')
      .set(values)
      .where('id', '=', user.id)
      .execute();

    await tx.deleteFrom('user_roles').where('userId', '=', user.id).execute();

    await Promise.all(
      user.roles.map(async (role) => {
        await tx
          .insertInto('user_roles')
          .values({ userId: user.id, roleId: role.id })
          .execute();
      })
    );

    return user;
  }

  public async delete(user: User): Promise<void> {
    const tx = this.database.transaction();

    await tx.deleteFrom('users').where('id', '=', user.id).execute();
  }

  public mapRawRole(raw: Selectable<Roles>) {
    return Role.reconstitute({
      ...raw,
      permissions: z.array(permissionSchema).parse(raw.permissions),
      routes: routesSchema.parse(raw.routes),
    });
  }

  private mapRawUser(raw: Selectable<Users> & { roles: unknown }) {
    return User.reconstitute({
      ...raw,
      roles: z.array(roleSchema).parse(raw.roles),
    });
  }

  public async save(user: User): Promise<User> {
    const tx = this.database.transaction();

    await tx
      .insertInto('users')
      .values({
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
      })
      .onConflict((oc) =>
        oc.column('id').doUpdateSet((eb) => ({
          email: eb.ref('excluded.email'),
          passwordHash: eb.ref('excluded.passwordHash'),
        }))
      )
      .execute();

    await tx.deleteFrom('user_roles').where('userId', '=', user.id).execute();

    await Promise.all(
      user.roles.map(async (role) => {
        await tx
          .insertInto('user_roles')
          .values({ userId: user.id, roleId: role.id })
          .execute();
      })
    );

    return user;
  }

  public async get(id: string): Promise<User | undefined> {
    const query = await this.getUsersQuery();

    const result = await query.where('u.id', '=', id).executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return this.mapRawUser(result);
  }

  public async list({
    start,
    limit,
  }: {
    start: number;
    limit: number;
  }): Promise<User[]> {
    const query = await this.getUsersQuery();

    const withLimit = query.offset(start ?? 0).limit(limit ?? 30);

    const result = await withLimit.execute();

    return result.map((row) => this.mapRawUser(row));
  }

  public async deleteUser(user: User): Promise<void> {
    const tx = this.database.transaction();

    await tx.deleteFrom('users').where('id', '=', user.id).execute();
  }

  private async getUsersQuery() {
    const tx = this.database.transaction();
    return tx
      .selectFrom('users as u')
      .leftJoinLateral(
        (eb) =>
          eb
            .selectFrom('user_roles as ur')
            .innerJoin('roles', 'roles.id', 'ur.roleId')
            .select([
              sql`jsonb_agg(
                       jsonb_build_object(
                         'id', roles.id,
                         'name', roles.name,
                         'permissions', roles.permissions,
                         'routes', roles.routes
                       )
                       ORDER BY roles.name
                     )`.as('roles'),
            ])
            .whereRef('ur.userId', '=', 'u.id')
            .as('r'),
        (join) => join.onTrue()
      )
      .select([
        'u.id',
        'u.email',
        'u.passwordHash',
        sql`coalesce(r.roles, '[]'::jsonb)`.as('roles'),
      ]);
  }
}
