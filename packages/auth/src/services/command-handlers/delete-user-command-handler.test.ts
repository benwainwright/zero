import { mock } from 'vitest-mock-extended';
import { DeleteUserCommandHandler } from './delete-user-command-handler.ts';
import { when } from 'vitest-when';
import { buildCommandHandler, getMockCommandContext } from '@test-helpers';
import type { User } from '@zero/domain';

describe('delete user command handler', () => {
  it('deletes the user if found', async () => {
    const { handler, userRepo } = buildCommandHandler(DeleteUserCommandHandler);

    const context = getMockCommandContext(
      'DeleteUserCommand',
      {
        username: 'ben',
      },
      'ben'
    );

    const mockUser = mock<User>();

    when(userRepo.get).calledWith('ben').thenResolve(mockUser);

    await handler.doHandle(context);

    expect(userRepo.delete).toHaveBeenCalledWith(mockUser);
  });
});
