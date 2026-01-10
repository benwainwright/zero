import { inject, type DB } from '@core';
import type { IOauthTokenRepository } from '@zero/accounts';
import { OauthToken } from '@zero/domain';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { Selectable } from 'kysely';
import type { OauthTokens } from '../core/database.ts';
import { BaseRepo } from './base-repo.ts';
import type { IWriteRepository } from '@zero/application-core';

export class SqliteOauthTokenRepository
  extends BaseRepo<OauthToken, [string, string]>
  implements IOauthTokenRepository, IWriteRepository<OauthToken>
{
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {
    super();
  }
  public async update(token: OauthToken): Promise<OauthToken> {
    const tx = this.database.transaction();

    await tx
      .updateTable('oauth_tokens')
      .set(this.mapValues(token))
      .where('id', '=', token.id)
      .execute();

    return token;
  }

  private mapRaw(raw: Selectable<OauthTokens>) {
    return OauthToken.reconstitute({
      ...raw,
      refreshed: raw.refreshed ? new Date(raw.refreshed) : undefined,
      refreshExpiry: raw.refreshExpiry
        ? new Date(raw.refreshExpiry)
        : undefined,
      lastUse: raw.lastUse ? new Date(raw.lastUse) : undefined,
      expiry: new Date(raw.expiry),
      created: new Date(raw.created),
    });
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

  public mapValues(token: OauthToken) {
    const values = token.toObject({ secure: true });
    return {
      ...values,
      created: values.created.toISOString(),
      expiry: values.expiry.toISOString(),
      lastUse: values.lastUse?.toISOString() ?? null,
      refreshExpiry: values.refreshExpiry?.toISOString() ?? null,
      refreshed: values.refreshed?.toISOString() ?? null,
    };
  }

  public async save(token: OauthToken): Promise<OauthToken> {
    const tx = this.database.transaction();

    await tx.insertInto('oauth_tokens').values(this.mapValues(token)).execute();

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
