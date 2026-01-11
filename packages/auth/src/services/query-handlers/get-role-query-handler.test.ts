import { GetRoleQueryHandler } from './get-role-query-handler.ts';
import { when } from 'vitest-when';
import { Role } from '@zero/domain';
import { mock } from 'vitest-mock-extended';
import { buildInstance, getQueryContextBuilder } from '@zero/test-helpers';
import type { AuthQueries } from '@services';

const getMockQueryContext = getQueryContextBuilder<AuthQueries>();

describe('get role query handler', () => {
  it('returns the role from the repo', async () => {
    const [handler, roleRepo] = await buildInstance(GetRoleQueryHandler);

    const context = getMockQueryContext('GetRole', { id: 'role' }, 'ben');

    const role = mock<Role>();

    when(roleRepo.require).calledWith('role').thenResolve(role);

    const result = await handler.tryHandle(context);

    expect(result.handled).toEqual(true);
    if (result.handled) {
      expect(result.response).toEqual(role);
    }
  });
});
