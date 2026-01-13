import { ACCOUNT_DETAILS_KEY } from '@constants';
import { inject } from '@core';
import type { AccountsQueries } from '@services';
import {
  AbstractQueryHandler,
  type IObjectStorage,
  type IQueryContext,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';

export class GetLinkedAccountsDetailsQuery extends AbstractQueryHandler<
  AccountsQueries,
  'GetLinkedAccountsDetailsQuery'
> {
  public override readonly name = 'GetLinkedAccountsDetailsQuery';
  public constructor(
    @inject('ObjectStore')
    private readonly objectStorage: IObjectStorage,

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
    key: 'GetLinkedAccountsDetailsQuery';
    params: undefined;
    response: { name: string; id: string; details: string }[];
  }>): Promise<{ name: string; id: string; details: string }[]> {
    this.grants.assertLogin(authContext);
    this.grants.requiresNoPermissions();
    const result = await this.objectStorage.get(
      ACCOUNT_DETAILS_KEY,
      authContext.id
    );
    if (!result) {
      return [];
    }
    return JSON.parse(result);
  }
}
