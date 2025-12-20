import { LoginCommandHandler } from './login-command-handler.ts';
import { mock } from 'vitest-mock-extended';
import { when } from 'vitest-when';
import type { User } from '@zero/domain';
import { buildCommandHandler, getMockCommandContext } from '@test-helpers';

describe('login command handler', async () => {
  it('checks the password and sets the current user if it is successful', async () => {
    const { handler, userRepo, passwordVerifier, eventBus, currentUserSetter } =
      buildCommandHandler(LoginCommandHandler);

    const context = getMockCommandContext('LoginCommand', {
      username: 'ben',
      password: 'foo',
    });

    const user = mock<User>({
      passwordHash: 'mockHash',
    });

    when(userRepo.getUser).calledWith('ben').thenResolve(user);

    when(passwordVerifier.verifyPassword)
      .calledWith('foo', 'mockHash')
      .thenResolve(true);

    await handler.doHandle(context);

    expect(currentUserSetter.set).toHaveBeenCalledWith(user);
    expect(eventBus.emit).toHaveBeenCalledWith(
      'LoginSuccessfulEvent',
      undefined
    );
  });

  it('checks does not set the current user if it fails, also emits loginfailedevent', async () => {
    const { handler, userRepo, passwordVerifier, eventBus, currentUserSetter } =
      buildCommandHandler(LoginCommandHandler);

    const context = getMockCommandContext('LoginCommand', {
      username: 'ben',
      password: 'foo',
    });

    const user = mock<User>({
      passwordHash: 'mockHash',
    });

    when(userRepo.getUser).calledWith('ben').thenResolve(user);

    when(passwordVerifier.verifyPassword)
      .calledWith('foo', 'mockHash')
      .thenResolve(false);

    await handler.doHandle(context);

    expect(currentUserSetter.set).not.toHaveBeenCalled();
    expect(eventBus.emit).toHaveBeenCalledWith('LoginFailedEvent', undefined);
  });

  it('check does not set the current user if it doesnt exist and emits loginfailedevent', async () => {
    const { handler, userRepo, eventBus, currentUserSetter } =
      buildCommandHandler(LoginCommandHandler);

    const context = getMockCommandContext('LoginCommand', {
      username: 'ben',
      password: 'foo',
    });

    when(userRepo.getUser).calledWith('ben').thenResolve(undefined);

    await handler.doHandle(context);

    expect(currentUserSetter.set).not.toHaveBeenCalled();
    expect(eventBus.emit).toHaveBeenCalledWith('LoginFailedEvent', undefined);
  });
});
