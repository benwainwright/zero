import {
  AbstractQueryHandler,
  type IQueryContext,
} from '@zero/application-core';
import type { AuthQueries } from '../auth-queries.ts';
import { User } from '@zero/domain';

export class GetCurrentUserQueryHandler extends AbstractQueryHandler<
  AuthQueries,
  'GetCurrentUser'
> {
  public override readonly name = 'GetCurrentUser';

  protected override async handle({
    authContext,
  }: IQueryContext<AuthQueries, 'GetCurrentUser'>): Promise<User | undefined> {
    if (authContext instanceof User) {
      return authContext;
    }

    return undefined;
  }
}
