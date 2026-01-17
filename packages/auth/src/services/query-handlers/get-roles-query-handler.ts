import {
  AbstractRequestHandler,
  type IRequestContext,
} from '@zero/application-core';
import type { AuthQueries } from '../auth-queries.ts';
import type { Role } from '@zero/domain';
import type { IGrantManager, IRoleRepository } from '@ports';
import type { ILogger } from '@zero/bootstrap';
import { inject } from '@core';

export class GetRolesQueryHandler extends AbstractRequestHandler<
  AuthQueries,
  'GetRoles'
> {
  public constructor(
    @inject('RoleRepository')
    private readonly roleRepo: IRoleRepository,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    params: { offset, limit },
  }: IRequestContext<{
    id: string;
    key: 'GetRoles';
    params: { limit: number; offset: number };
    response: Role[];
  }>): Promise<Role[]> {
    this.grants.requires({
      capability: 'role:list',
    });

    return await this.roleRepo.list({ start: offset, limit });
  }
  public override readonly name = 'GetRoles';
}
