import { inject, type OauthTokens } from '@core';
import { OauthToken } from '@zero/domain';
import { BaseRepo, type IKyselyTransactionManager } from '@zero/kysely-shared';
import type { Selectable } from 'kysely';
import type { DB } from '../core/database.ts';
import type { IWriteRepository } from '@zero/application-core';
import type { IOauthTokenRepository } from '@zero/accounts';

export class PostgresOauthTokenRepository
  extends BaseRepo<OauthToken, [string, string]>
  implements IWriteRepository<OauthToken>, IOauthTokenRepository
{
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {
    super();
  }

  private mapRaw(raw: Selectable<OauthTokens>) {
    return OauthToken.reconstitute({
      ...raw,
      refreshed: raw.refreshed ?? undefined,
      refreshExpiry: raw.refreshExpiry ?? undefined,
      lastUse: raw.lastUse ?? undefined,
    });
  }

  public async update(token: OauthToken) {
    const tx = this.database.transaction();

    await tx
      .updateTable('oauth_tokens')
      .set(token.toObject({ secure: true }))
      .where('id', '=', token.id)
      .execute();

    return token;
  }

  public async get(
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

    return this.mapRaw(result);
  }
  public async save(token: OauthToken): Promise<OauthToken> {
    const tx = this.database.transaction();

    await tx
      .insertInto('oauth_tokens')
      .values(token.toObject({ secure: true }))
      .execute();

    return token;
  }
  public async delete(token: OauthToken): Promise<void> {
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
}
