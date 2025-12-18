import {
  type ICurrentUserSetter,
  type IPasswordVerifier,
  type IUserRepository,
} from '@ports';
import { LoginCommandHandler } from './login-command-handler.ts';
import { mock } from 'vitest-mock-extended';
import { when } from 'vitest-when';
import type { User } from '@zero/domain';
import { getMockCommandContext } from '@test-helpers';
import { type IAllEvents, type IEventBus } from '@zero/application-core';
import type { IAuthEvents } from './auth-events.ts';

const getHandler = () => {
  const userRepo = mock<IUserRepository>();
  const passwordVerifier = mock<IPasswordVerifier>();
  const currentUserSetter = mock<ICurrentUserSetter>();
  const eventBus = mock<IEventBus<IAllEvents & IAuthEvents>>();

  return {
    handler: new LoginCommandHandler(
      userRepo,
      passwordVerifier,
      currentUserSetter,
      eventBus
    ),
    eventBus,
    userRepo,
    passwordVerifier,
    currentUserSetter,
  };
};

describe('login command handler', async () => {
  it('checks the password and sets the current user if it is successful', async () => {
    const { handler, userRepo, passwordVerifier, eventBus, currentUserSetter } =
      getHandler();

    const context = getMockCommandContext('LoginCommand', {
      username: 'ben',
      password: 'foo',
    });

    const user = mock<User>({
      passwordHash: 'mockHash',
    });

    when(userRepo.get).calledWith('ben').thenResolve(user);

    when(passwordVerifier.verifyPassword)
      .calledWith('foo', 'mockHash')
      .thenResolve(true);

    await handler.doHandle(context);

    expect(currentUserSetter.set).toHaveBeenCalledWith(user);
    expect(eventBus.emit).toHaveBeenCalledWith('LoginEvent');
  });

  it('checks does not set the current user if it fails, also emits loginfailedevent', async () => {
    const { handler, userRepo, passwordVerifier, eventBus, currentUserSetter } =
      getHandler();

    const context = getMockCommandContext('LoginCommand', {
      username: 'ben',
      password: 'foo',
    });

    const user = mock<User>({
      passwordHash: 'mockHash',
    });

    when(userRepo.get).calledWith('ben').thenResolve(user);

    when(passwordVerifier.verifyPassword)
      .calledWith('foo', 'mockHash')
      .thenResolve(false);

    await handler.doHandle(context);

    expect(currentUserSetter.set).not.toHaveBeenCalled();
    expect(eventBus.emit).toHaveBeenCalledWith('LoginFailedEvent');
  });

  it('check does not set the current user if it doesnt exist and emits loginfailedevent', async () => {
    const { handler, userRepo, eventBus, currentUserSetter } = getHandler();

    const context = getMockCommandContext('LoginCommand', {
      username: 'ben',
      password: 'foo',
    });

    when(userRepo.get).calledWith('ben').thenResolve(undefined);

    await handler.doHandle(context);

    expect(currentUserSetter.set).not.toHaveBeenCalled();
    expect(eventBus.emit).toHaveBeenCalledWith('LoginFailedEvent');
  });
});
