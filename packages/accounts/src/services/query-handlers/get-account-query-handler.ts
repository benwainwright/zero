import {
  AbstractRequestHandler,
  type IRequestContext,
} from '@zero/application-core';
import type { AccountsQueries } from '../accounts-queries.ts';
import type { Account } from '@zero/domain';
import { injectable } from 'inversify';
import type { ILogger } from '@zero/bootstrap';
import { inject } from '@core';
import type { IAccountRepository } from '@ports';
import type { IGrantManager } from '@zero/auth';

@injectable()
export class GetAccountQueryHandler extends AbstractRequestHandler<
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
    params: { id },
  }: IRequestContext<{
    id: string;
    key: 'GetAccountQuery';
    params: { id: string };
    response: Account;
  }>): Promise<Account> {
    this.grants.requires({
      capability: 'account:read',
    });

    return await this.accounts.require(id);
  }
  public override readonly name = 'GetAccountQuery';
}
