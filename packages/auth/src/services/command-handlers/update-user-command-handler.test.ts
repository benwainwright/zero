import { UpdateUserCommandHandler } from './update-user-command-handler.ts';
import { buildCommandHandler, getMockCommandContext } from '@test-helpers';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import type { Role, User } from '@zero/domain';
import { UserNotFoundError } from '@core';

describe('Update user command handler', () => {
  it('will throw an error if the user isnt found', async () => {
    const { handler, userRepo } = buildCommandHandler(UpdateUserCommandHandler);

    const context = getMockCommandContext('UpdateUserCommand', {
      username: 'ben',
      email: 'a@b.c',
      password: 'foo',
      roles: [],
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
      roles: [],
    });

    const mockUser = mock<User>();

    when(userRepo.getUser).calledWith('ben').thenResolve(mockUser);
    when(passwordHasher.hashPassword).calledWith('foo').thenResolve('hash');

    await handler.tryHandle(context);

    expect(mockUser.update).toHaveBeenCalledWith({
      email: 'a@b.c',
      hash: 'hash',
      roles: [],
    });

    expect(userRepo.saveUser).toHaveBeenCalledWith(mockUser);
  });

  it('will get roles from role repo if any updates are made', async () => {
    const { handler, userRepo, passwordHasher, roleRepo } = buildCommandHandler(
      UpdateUserCommandHandler
    );
    const mockFooRole = mock<Role>();
    const mockBarRole = mock<Role>();

    when(roleRepo.requireRole).calledWith('foo').thenResolve(mockFooRole);
    when(roleRepo.requireRole).calledWith('bar').thenResolve(mockBarRole);

    const context = getMockCommandContext('UpdateUserCommand', {
      username: 'ben',
      email: 'a@b.c',
      password: 'foo',
      roles: ['foo', 'bar'],
    });

    const mockUser = mock<User>();

    when(userRepo.getUser).calledWith('ben').thenResolve(mockUser);
    when(passwordHasher.hashPassword).calledWith('foo').thenResolve('hash');

    await handler.tryHandle(context);

    expect(mockUser.update).toHaveBeenCalledWith({
      email: 'a@b.c',
      hash: 'hash',
      roles: [mockFooRole, mockBarRole],
    });

    expect(userRepo.saveUser).toHaveBeenCalledWith(mockUser);
  });
});
