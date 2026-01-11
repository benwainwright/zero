import { UpdateUserCommandHandler } from './update-user-command-handler.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import type { Role, User } from '@zero/domain';
import { UserNotFoundError } from '@core';
import { buildInstance, getCommandContextBuilder } from '@zero/test-helpers';
import type { AuthCommands } from '@services';

const getMockCommandContext = getCommandContextBuilder<AuthCommands>();

describe('Update user command handler', () => {
  it('will throw an error if the user isnt found', async () => {
    const [handler, userRepo] = await buildInstance(UpdateUserCommandHandler);

    const context = getMockCommandContext('UpdateUserCommand', {
      username: 'ben',
      email: 'a@b.c',
      password: 'foo',
      roles: [],
    });

    when(userRepo.get).calledWith('ben').thenResolve(undefined);
    await expect(handler.tryHandle(context)).rejects.toThrow(UserNotFoundError);
  });

  it('will update an existing user', async () => {
    const [handler, userRepo, passwordHasher, , , userWriter] =
      await buildInstance(UpdateUserCommandHandler);

    const context = getMockCommandContext('UpdateUserCommand', {
      username: 'ben',
      email: 'a@b.c',
      password: 'foo',
      roles: [],
    });

    const mockUser = mock<User>();

    when(userRepo.get).calledWith('ben').thenResolve(mockUser);
    when(passwordHasher.hashPassword).calledWith('foo').thenResolve('hash');

    await handler.tryHandle(context);

    expect(mockUser.update).toHaveBeenCalledWith({
      email: 'a@b.c',
      hash: 'hash',
      roles: [],
    });

    expect(userWriter.save).toHaveBeenCalledWith(mockUser);
  });

  it('will get roles from role repo if any updates are made', async () => {
    const [handler, userRepo, passwordHasher, , roleRepo, userWriter] =
      await buildInstance(UpdateUserCommandHandler);
    const mockFooRole = mock<Role>();
    const mockBarRole = mock<Role>();

    when(roleRepo.require).calledWith('foo').thenResolve(mockFooRole);
    when(roleRepo.require).calledWith('bar').thenResolve(mockBarRole);

    const context = getMockCommandContext('UpdateUserCommand', {
      username: 'ben',
      email: 'a@b.c',
      password: 'foo',
      roles: ['foo', 'bar'],
    });

    const mockUser = mock<User>();

    when(userRepo.get).calledWith('ben').thenResolve(mockUser);
    when(passwordHasher.hashPassword).calledWith('foo').thenResolve('hash');

    await handler.tryHandle(context);

    expect(mockUser.update).toHaveBeenCalledWith({
      email: 'a@b.c',
      hash: 'hash',
      roles: [mockFooRole, mockBarRole],
    });

    expect(userWriter.save).toHaveBeenCalledWith(mockUser);
  });
});
