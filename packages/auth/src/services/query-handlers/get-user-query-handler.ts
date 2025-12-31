import {
  AbstractQueryHandler,
  type IQueryContext,
} from '@zero/application-core';
import type { AuthQueries } from '../auth-queries.ts';
import type { User } from '@zero/domain';
import type { ILogger } from '@zero/bootstrap';
import { AuthError, inject } from '@core';
import type { IGrantManager, IUserRepository } from '@ports';

export class GetUserQueryHandler extends AbstractQueryHandler<
  AuthQueries,
  'GetUser'
> {
  public constructor(
    @inject('UserRepository')
    private readonly users: IUserRepository,

    @inject('GrantService')
    private readonly grant: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    query: { username },
  }: IQueryContext<{
    id: string;
    key: 'GetUser';
    params: { username: string };
    response: User;
  }>): Promise<User> {
    const user = await this.users.requireUser(username);

    this.grant.requires({
      capability: 'user:read',
      for: user,
    });

    return user;
  }

  public override readonly name = 'GetUser';
}
