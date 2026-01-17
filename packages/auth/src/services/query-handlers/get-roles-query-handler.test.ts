import { when } from 'vitest-when';
import { GetRolesQueryHandler } from './get-roles-query-handler.ts';
import { mock } from 'vitest-mock-extended';
import type { Role } from '@zero/domain';
import { buildInstance, getRequestContextBuilder } from '@zero/test-helpers';
import type { AuthQueries } from '@services';

const getMockRequestContext = getRequestContextBuilder<AuthQueries>();

describe('get roles query handler', () => {
  it('gets the roles from the role repo and returns them', async () => {
    const [handler, roleRepo] = await buildInstance(GetRolesQueryHandler);

    const context = getMockRequestContext(
      'GetRoles',
      { offset: 0, limit: 30 },
      'ben'
    );

    const roles = [mock<Role>(), mock<Role>()];

    when(roleRepo.list).calledWith({ start: 0, limit: 30 }).thenResolve(roles);

    const result = await handler.tryHandle(context);

    expect(result.handled).toEqual(true);
    if (result.handled) {
      expect(result.response).toEqual(roles);
    }
  });
});
