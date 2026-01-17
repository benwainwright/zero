import { UpdateUserCommandHandler } from './update-user-command-handler.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import type { Role, User } from '@zero/domain';
import { UserNotFoundError } from '@core';
import { buildRequestHandler } from '@zero/test-helpers';

describe('Update user command handler', () => {
  it('will throw an error if the user isnt found', async () => {
    const {
      handler,
      context,
      dependencies: [userRepo],
    } = await buildRequestHandler(
      UpdateUserCommandHandler,
      'UpdateUserCommand',
      {
        username: 'ben',
        email: 'a@b.c',
        password: 'foo',
        roles: [],
      }
    );

    when(userRepo.get).calledWith('ben').thenResolve(undefined);
    await expect(handler.tryHandle(context)).rejects.toThrow(UserNotFoundError);
  });

  it('will update an existing user', async () => {
    const {
      handler,
      context,
      dependencies: [userRepo, passwordHasher, , , userWriter],
    } = await buildRequestHandler(
      UpdateUserCommandHandler,
      'UpdateUserCommand',
      {
        username: 'ben',
        email: 'a@b.c',
        password: 'foo',
        roles: [],
      }
    );

    const mockUser = mock<User>();

    when(userRepo.get).calledWith('ben').thenResolve(mockUser);
    when(passwordHasher.hashPassword).calledWith('foo').thenResolve('hash');

    await handler.tryHandle(context);

    expect(mockUser.update).toHaveBeenCalledWith({
      email: 'a@b.c',
      hash: 'hash',
      roles: [],
    });

    expect(userWriter.update).toHaveBeenCalledWith(mockUser);
  });

  it('will get roles from role repo if any updates are made', async () => {
    const {
      handler,
      context,
      dependencies: [userRepo, passwordHasher, , roleRepo, userWriter],
    } = await buildRequestHandler(
      UpdateUserCommandHandler,
      'UpdateUserCommand',
      {
        username: 'ben',
        email: 'a@b.c',
        password: 'foo',
        roles: ['foo', 'bar'],
      }
    );

    const mockFooRole = mock<Role>();
    const mockBarRole = mock<Role>();

    when(roleRepo.require).calledWith('foo').thenResolve(mockFooRole);
    when(roleRepo.require).calledWith('bar').thenResolve(mockBarRole);

    const mockUser = mock<User>();

    when(userRepo.get).calledWith('ben').thenResolve(mockUser);
    when(passwordHasher.hashPassword).calledWith('foo').thenResolve('hash');

    await handler.tryHandle(context);

    expect(mockUser.update).toHaveBeenCalledWith({
      email: 'a@b.c',
      hash: 'hash',
      roles: [mockFooRole, mockBarRole],
    });

    expect(userWriter.update).toHaveBeenCalledWith(mockUser);
  });
});
