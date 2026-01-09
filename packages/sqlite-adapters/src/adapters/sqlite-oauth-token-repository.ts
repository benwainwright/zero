import { inject, type DB } from '@core';
import type { IOauthTokenRepository } from '@zero/accounts';
import { OauthToken } from '@zero/domain';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { Selectable } from 'kysely';
import type { OauthTokens } from '../core/database.ts';

export class SqliteOauthTokenRepository implements IOauthTokenRepository {
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {}

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

    return this.mapRaw(result);
  }
  public async saveToken(token: OauthToken): Promise<OauthToken> {
    const tx = this.database.transaction();

    const values = token.toObject({ secure: true });

    await tx
      .insertInto('oauth_tokens')
      .values({
        ...values,
        created: values.created.toISOString(),
        expiry: values.expiry.toISOString(),
        lastUse: values.lastUse?.toISOString() ?? null,
        refreshExpiry: values.refreshExpiry?.toISOString() ?? null,
        refreshed: values.refreshed?.toISOString() ?? null,
      })
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
}
