import { mock } from 'vitest-mock-extended';
import { DeleteUserCommandHandler } from './delete-user-command-handler.ts';
import { when } from 'vitest-when';
import type { User } from '@zero/domain';
import { buildRequestHandler } from '@zero/test-helpers';

describe('delete user command handler', () => {
  it('deletes the user if found', async () => {
    const {
      handler,
      context,
      dependencies: [userRepo, userWriter],
    } = await buildRequestHandler(
      DeleteUserCommandHandler,
      'DeleteUserCommand',
      {
        username: 'ben',
      }
    );

    const mockUser = mock<User>();

    when(userRepo.require).calledWith('ben').thenResolve(mockUser);

    await handler.tryHandle(context);

    expect(userWriter.delete).toHaveBeenCalledWith(mockUser);
  });
});
