import {
  AbstractQueryHandler,
  type IQueryContext,
} from '@zero/application-core';
import type { AuthQueries } from '../auth-queries.ts';
import type { User } from '@zero/domain';
import type { ILogger } from '@zero/bootstrap';
import { GrantService, inject } from '@core';
import type { IUserRepository } from '@ports';

export class GetUsersQueryHandler extends AbstractQueryHandler<
  AuthQueries,
  'GetUsers'
> {
  public constructor(
    @inject('UserRepository')
    private readonly users: IUserRepository,

    @inject("GrantService")
    private readonly grants: GrantService

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override handle(
    context: IQueryContext<AuthQueries, 'GetUsers'>
  ): Promise<User[]> {

    this.grants.requires({
      capability: "user:read",

    })

  }
  public override readonly name = 'GetUsers';
}
