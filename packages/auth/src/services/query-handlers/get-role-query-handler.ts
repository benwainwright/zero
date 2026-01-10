import { inject } from '@core';
import type { IGrantManager, IRoleRepository } from '@ports';
import type { AuthQueries } from '@services';
import {
  AbstractQueryHandler,
  type IQueryContext,
} from '@zero/application-core';
import type { ILogger } from '@zero/bootstrap';
import type { Role } from '@zero/domain';

export class GetRoleQueryHandler extends AbstractQueryHandler<
  AuthQueries,
  'GetRole'
> {
  public constructor(
    @inject('RoleRepository')
    private readonly roleRepo: IRoleRepository,

    @inject('Logger')
    logger: ILogger,

    @inject('GrantService')
    private readonly grants: IGrantManager
  ) {
    super(logger);
  }

  protected override async handle({
    query: { id },
  }: IQueryContext<{
    id: string;
    key: 'GetRole';
    params: { id: string };
    response: Role;
  }>): Promise<Role> {
    const theRole = await this.roleRepo.require(id);
    this.grants.requires({ capability: 'role:read', for: theRole });
    return theRole;
  }
  public override readonly name = 'GetRole';
}
