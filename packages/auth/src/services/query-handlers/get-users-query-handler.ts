import {
  AbstractQueryHandler,
  type IPickQuery,
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

    @inject('GrantService')
    private readonly grants: GrantService,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    query: { offset, limit },
  }: IQueryContext<IPickQuery<AuthQueries, 'GetUsers'>>): Promise<User[]> {
    this.grants.requires({
      capability: 'user:list',
    });

    const users = await this.users.getManyUsers(offset, limit);

    return users;
  }
  public override readonly name = 'GetUsers';
}
