import { inject } from '@core';
import type { AccountsQueries } from '@services';
import {
  AbstractQueryHandler,
  type IObjectStorage,
  type IQueryContext,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';

export class GetBankAuthLinkQueryHandler extends AbstractQueryHandler<
  AccountsQueries,
  'GetBankAuthLinkQuery'
> {
  public constructor(
    @inject('ObjectStore')
    private readonly store: IObjectStorage,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }
  protected override async handle({
    authContext,
  }: IQueryContext<{
    id: string;
    key: 'GetBankAuthLinkQuery';
    params: undefined;
    response: { url: string | undefined };
  }>): Promise<{ url: string | undefined }> {
    this.grants.requiresNoPermissions();
    this.grants.assertLogin(authContext);

    return { url: await this.store.get('bank-auth-link', authContext.id) };
  }
  public override readonly name = 'GetBankAuthLinkQuery';
}
