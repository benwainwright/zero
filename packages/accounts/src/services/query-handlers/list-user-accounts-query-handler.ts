import {
  AbstractQueryHandler,
  AppError,
  type IQueryContext,
} from '@zero/application-core';
import type { AccountsQueries } from '../accounts-queries.ts';
import type { Account } from '@zero/domain';
import { injectable } from 'inversify';
import type { ILogger } from '@zero/bootstrap';
import { inject } from '@core';
import type { IAccountRepository } from '@ports';
import type { IGrantManager } from '@zero/auth';

@injectable()
export class ListUserAccountsQueryHandler extends AbstractQueryHandler<
  AccountsQueries,
  'ListUserAccountsQuery'
> {
  public constructor(
    @inject('AccountRepository')
    private readonly accounts: IAccountRepository,

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
    key: 'ListUserAccountsQuery';
    params: undefined;
    response: Account[];
  }>): Promise<Account[]> {
    this.grants.requires({
      capability: 'account:list',
    });

    if (!authContext) {
      throw new AppError('Must be logged in');
    }

    return await this.accounts.getUserAccounts(authContext.id);
  }

  public override readonly name = 'ListUserAccountsQuery';
}
