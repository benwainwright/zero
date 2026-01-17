import {
  AbstractRequestHandler,
  type IPickRequest,
  type IRequestContext,
} from '@zero/application-core';
import type { AuthQueries } from '../auth-queries.ts';
import { User } from '@zero/domain';
import type { IGrantManager } from '@ports';
import { inject } from '@core';
import type { ILogger } from '@zero/bootstrap';

export class GetCurrentUserQueryHandler extends AbstractRequestHandler<
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
  }: IRequestContext<IPickRequest<AuthQueries, 'GetCurrentUser'>>): Promise<
    User | undefined
  > {
    this.grant.requiresNoPermissions();

    return authContext;
  }
}
