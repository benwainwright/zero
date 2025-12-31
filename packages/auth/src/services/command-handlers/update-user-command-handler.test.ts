import { UpdateUserCommandHandler } from './update-user-command-handler.ts';
import { buildCommandHandler, getMockCommandContext } from '@test-helpers';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import type { User } from '@zero/domain';
import { UserNotFoundError } from '@core';

describe('Update user command handler', () => {
  it('will throw an error if the user isnt found', async () => {
    const { handler, userRepo } = buildCommandHandler(UpdateUserCommandHandler);

    const context = getMockCommandContext('UpdateUserCommand', {
      username: 'ben',
      email: 'a@b.c',
      password: 'foo',
    });

    when(userRepo.getUser).calledWith('ben').thenResolve(undefined);
    await expect(handler.tryHandle(context)).rejects.toThrow(UserNotFoundError);
  });
  it('will update an existing user', async () => {
    const { handler, userRepo, passwordHasher } = buildCommandHandler(
      UpdateUserCommandHandler
    );

    const context = getMockCommandContext('UpdateUserCommand', {
      username: 'ben',
      email: 'a@b.c',
      password: 'foo',
    });

    const mockUser = mock<User>();

    when(userRepo.getUser).calledWith('ben').thenResolve(mockUser);
    when(passwordHasher.hashPassword).calledWith('foo').thenResolve('hash');

    await handler.tryHandle(context);

    expect(mockUser.update).toHaveBeenCalledWith({
      email: 'a@b.c',
      hash: 'hash',
    });

    expect(userRepo.saveUser).toHaveBeenCalledWith(mockUser);
  });
});
