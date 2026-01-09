import {
  AbstractQueryHandler,
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
export class GetAccountQueryHandler extends AbstractQueryHandler<
  AccountsQueries,
  'GetAccountQuery'
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
    query: { id },
  }: IQueryContext<{
    id: string;
    key: 'GetAccountQuery';
    params: { id: string };
    response: Account;
  }>): Promise<Account> {
    this.grants.requires({
      capability: 'account:read',
    });

    return await this.accounts.requireAccount(id);
  }
  public override readonly name = 'GetAccountQuery';
}
