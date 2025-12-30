import {
  AbstractQueryHandler,
  type IQueryContext,
} from '@zero/application-core';
import type { AuthQueries } from '../auth-queries.ts';
import { User } from '@zero/domain';
import type { IGrantManager } from '@ports';
import { inject } from '@core';
import type { ILogger } from '@zero/bootstrap';

export class GetCurrentUserQueryHandler extends AbstractQueryHandler<
  AuthQueries,
  'GetCurrentUser'
> {
  public constructor(
    @inject('GrantService')
    private grant: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  public override readonly name = 'GetCurrentUser';

  protected override async handle({
    authContext,
  }: IQueryContext<AuthQueries, 'GetCurrentUser'>): Promise<User | undefined> {
    this.grant.requiresNoPermissions();

    if (authContext instanceof User) {
      return authContext;
    }

    return undefined;
  }
}
