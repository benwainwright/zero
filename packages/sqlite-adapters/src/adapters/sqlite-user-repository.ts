import type { IUserRepository } from '@zero/auth';
import {
  Role,
  User,
  permissionSchema,
  roleSchema,
  routesSchema,
  type IRole,
} from '@zero/domain';
import { inject, type DB } from '@core';
import z from 'zod';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import { sql, type Selectable } from 'kysely';
import type { Roles, Users } from '../core/database.ts';

export class SqliteUserRepository implements IUserRepository {
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {}

  public mapRawRole(raw: Selectable<Roles>) {
    return Role.reconstitute({
      ...raw,
      permissions: z.array(permissionSchema).parse(JSON.parse(raw.permissions)),
      routes: routesSchema.parse(JSON.parse(raw.routes)),
    });
  }

  private mapRawUser(raw: Selectable<Users> & { roles: unknown }) {
    const roles = JSON.parse(raw.roles as string) as Selectable<Roles>[];
    return User.reconstitute({
      ...raw,
      roles: roles.map(this.mapRawRole),
    });
  }

  public async saveUser(user: User): Promise<User> {
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

  public async requireUser(id: string): Promise<User> {
    const user = await this.getUser(id);

    if (!user) {
      throw new Error(`User '${id}' was not found!`);
    }

    return user;
  }

  public async getManyUsers(start?: number, limit?: number): Promise<User[]> {
    const query = await this.getUsersQuery();

    const withLimit = query.offset(start ?? 0).limit(limit ?? 30);

    const result = await withLimit.execute();

    return result.map((row) => this.mapRawUser(row));
  }

  public async deleteUser(user: User): Promise<void> {
    const tx = this.database.transaction();

    await tx.deleteFrom('users').where('id', '=', user.id).execute();
  }

  public async getUser(id: string): Promise<User | undefined> {
    const query = await this.getUsersQuery();

    const result = await query.where('users.id', '=', id).executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return this.mapRawUser(result);
  }

  private async getUsersQuery() {
    const tx = this.database.transaction();

    return tx.selectFrom('users').select(({ selectFrom, eb }) => [
      'users.email',
      'users.id',
      'users.passwordHash',
      eb
        .fn('coalesce', [
          selectFrom('user_roles as ur')
            .leftJoin('roles', 'roles.id', 'ur.roleId')
            .select(({ fn, eb }) =>
              fn('json_group_array', [
                fn('json_object', [
                  eb.val('id'),
                  'roles.id',
                  eb.val('name'),
                  'roles.name',
                  eb.val('permissions'),
                  'roles.permissions',
                  eb.val('routes'),
                  'roles.routes',
                ]),
              ]).as('roj')
            )
            .whereRef('ur.userId', '=', 'users.id')
            .orderBy('roles.name'),
          sql`'[]'`,
        ])
        .as('roles'),
    ]);
  }
}
