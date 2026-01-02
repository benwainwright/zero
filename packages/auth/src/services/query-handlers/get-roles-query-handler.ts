import {
  AbstractQueryHandler,
  type IQueryContext,
} from '@zero/application-core';
import type { AuthQueries } from '../auth-queries.ts';
import type { Role } from '@zero/domain';
import type { IGrantManager, IRoleRepository } from '@ports';
import type { ILogger } from '@zero/bootstrap';
import { inject } from '@core';

export class GetRolesQueryHandler extends AbstractQueryHandler<
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
    query: { offset, limit },
  }: IQueryContext<{
    id: string;
    key: 'GetRoles';
    params: { limit: number; offset: number };
    response: Role[];
  }>): Promise<Role[]> {
    this.grants.requires({
      capability: 'role:list',
    });

    return await this.roleRepo.getManyRoles(offset, limit);
  }
  public override readonly name = 'GetRoles';
}
