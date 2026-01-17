import {
  AbstractRequestHandler,
  type IPickRequest,
  type IRequestContext,
} from '@zero/application-core';
import type { AuthQueries } from '../auth-queries.ts';
import type { User } from '@zero/domain';
import type { ILogger } from '@zero/bootstrap';
import { GrantService, inject } from '@core';
import type { IUserRepository } from '@ports';

export class GetUsersQueryHandler extends AbstractRequestHandler<
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
    params: { offset, limit },
  }: IRequestContext<IPickRequest<AuthQueries, 'GetUsers'>>): Promise<User[]> {
    this.grants.requires({
      capability: 'user:list',
    });

    const users = await this.users.list({ start: offset, limit });

    return users;
  }
  public override readonly name = 'GetUsers';
}
