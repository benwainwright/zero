import { buildQueryHandler, getMockQueryContext } from '@test-helpers';
import { GetRoleQueryHandler } from './get-role-query-handler.ts';
import { when } from 'vitest-when';
import { Role } from '@zero/domain';
import { mock } from 'vitest-mock-extended';

describe('get role query handler', () => {
  it('returns the role from the repo', async () => {
    const { handler, roleRepo } = buildQueryHandler(GetRoleQueryHandler);

    const context = getMockQueryContext('GetRole', { id: 'role' }, 'ben');

    const role = mock<Role>();

    when(roleRepo.requireRole).calledWith('role').thenResolve(role);

    const result = await handler.tryHandle(context);

    expect(result.handled).toEqual(true);
    if (result.handled) {
      expect(result.response).toEqual(role);
    }
  });
});
