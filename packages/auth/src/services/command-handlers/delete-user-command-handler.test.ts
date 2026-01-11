import { mock } from 'vitest-mock-extended';
import { DeleteUserCommandHandler } from './delete-user-command-handler.ts';
import { when } from 'vitest-when';
import type { User } from '@zero/domain';
import { buildInstance, getCommandContextBuilder } from '@zero/test-helpers';
import type { AuthCommands } from '@services';

const getMockCommandContext = getCommandContextBuilder<AuthCommands>();

describe('delete user command handler', () => {
  it('deletes the user if found', async () => {
    const [handler, userRepo, userWriter] = await buildInstance(
      DeleteUserCommandHandler
    );

    const context = getMockCommandContext(
      'DeleteUserCommand',
      {
        username: 'ben',
      },
      'ben'
    );

    const mockUser = mock<User>();

    when(userRepo.require).calledWith('ben').thenResolve(mockUser);

    await handler.tryHandle(context);

    expect(userWriter.delete).toHaveBeenCalledWith(mockUser);
  });
});
