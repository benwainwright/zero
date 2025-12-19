import type { IUserRepository } from '@ports';
import type { ILogger } from '@zero/bootstrap';
import { mock } from 'vitest-mock-extended';
import { DeleteUserCommandHandler } from './delete-user-command-handler.ts';
import { when } from 'vitest-when';
import { getMockCommandContext } from '@test-helpers';
import type { User } from '@zero/domain';

const getHandler = () => {
  const userRepo = mock<IUserRepository>();
  const logger = mock<ILogger>();

  const handler = new DeleteUserCommandHandler(userRepo, logger);

  return { handler, userRepo, logger };
};

describe('delete user command handler', () => {
  it('deletes the user if found', async () => {
    const { handler, userRepo } = getHandler();

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
