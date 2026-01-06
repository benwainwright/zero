import { inject, json, type PostgressDatabase } from '@core';
import type { IUserRepository, IRoleRepository } from '@zero/auth';
import type { IAccountRepository, IOauthTokenRepository } from '@zero/accounts';
import { Account, OauthToken, Role, User, type IUser } from '@zero/domain';
import { injectable } from 'inversify';
import { sql } from 'kysely';

@injectable()
export class PostgresRepositoryAdapter
  implements
    IUserRepository,
    IRoleRepository,
    IAccountRepository,
    IOauthTokenRepository
{
  public constructor(
    @inject('PostgresDatabase')
    private readonly database: PostgressDatabase
  ) {}

  public async getToken(
    userId: string,
    provider: string
  ): Promise<OauthToken | undefined> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('oauth_tokens')
      .selectAll()
      .where((eb) =>
        eb.and([eb('ownerId', '=', userId), eb('provider', '=', provider)])
      )
      .executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return OauthToken.reconstitute(result);
  }

  public async saveToken(token: OauthToken): Promise<OauthToken> {
    const tx = this.database.transaction();

    await tx
      .insertInto('oauth_tokens')
      .values(token.toObject())
      .onConflict((oc) =>
        oc.column('id').doUpdateSet((eb) => ({
          expiry: eb.ref('excluded.expiry'),
          token: eb.ref('excluded.token'),
          refreshToken: eb.ref('excluded.refreshToken'),
          provider: eb.ref('excluded.provider'),
          ownerId: eb.ref('excluded.ownerId'),
          refreshExpiry: eb.ref('excluded.refreshExpiry'),
          lastUse: eb.ref('excluded.lastUse'),
          refreshed: eb.ref('excluded.refreshed'),
          created: eb.ref('excluded.created'),
        }))
      )
      .execute();

    return token;
  }

  public async deleteToken(token: OauthToken): Promise<void> {
    const tx = this.database.transaction();

    await tx
      .deleteFrom('oauth_tokens')
      .where((eb) =>
        eb.and([
          eb('ownerId', '=', token.ownerId),
          eb('provider', '=', token.provider),
        ])
      )
      .execute();
  }

  public async getAccount(id: string): Promise<Account | undefined> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('accounts')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return Account.reconstitute(result);
  }

  public async getUserAccounts(userId: string): Promise<Account[]> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('accounts')
      .selectAll()
      .where('ownerId', '=', userId)
      .execute();

    console.log({ result });

    return result.map((row) => Account.reconstitute(row));
  }

  public async saveAccount(account: Account): Promise<Account> {
    const tx = this.database.transaction();

    await tx
      .insertInto('accounts')
      .values(account.toObject())
      .onConflict((oc) =>
        oc.column('id').doUpdateSet((eb) => ({
          name: eb.ref('excluded.name'),
          type: eb.ref('excluded.type'),
          closed: eb.ref('excluded.closed'),
          balance: eb.ref('excluded.balance'),
          deleted: eb.ref('excluded.deleted'),
          ownerId: eb.ref('excluded.ownerId'),
        }))
      )
      .execute();

    return account;
  }

  public async deleteAccount(account: Account): Promise<void> {
    const tx = this.database.transaction();

    await tx.deleteFrom('accounts').where('id', '=', account.id).execute();
  }

  public async saveAccounts(accounts: Account[]): Promise<Account[]> {
    for (const account of accounts) {
      await this.saveAccount(account);
    }
    return accounts;
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

  public async requireRole(id: string): Promise<Role> {
    const role = await this.getRole(id);

    if (!role) {
      throw new Error(`Role '${id}' was not found`);
    }
    return role;
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

  public async requireUser(id: string): Promise<User> {
    const user = await this.getUser(id);

    if (!user) {
      throw new Error(`User '${id}' was not found!`);
    }

    return user;
  }

  public async getUser(id: string): Promise<User | undefined> {
    const query = await this.getUsersQuery();

    const result = await query.where('u.id', '=', id).executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return User.reconstitute(result as IUser);
  }

  public async getManyUsers(start?: number, limit?: number): Promise<User[]> {
    const query = await this.getUsersQuery();

    const withLimit = query.offset(start ?? 0).limit(limit ?? 30);

    const result = await withLimit.execute();

    return result.map((row) => User.reconstitute(row as IUser));
  }

  public async deleteUser(user: User): Promise<void> {
    const tx = this.database.transaction();

    await tx.deleteFrom('users').where('id', '=', user.id).execute();
  }
}
