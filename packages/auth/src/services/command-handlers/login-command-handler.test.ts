import { LoginCommandHandler } from './login-command-handler.ts';
import { mock } from 'vitest-mock-extended';
import { when } from 'vitest-when';
import type { User } from '@zero/domain';
import { buildRequestHandler } from '@zero/test-helpers';

describe('login command handler', async () => {
  it('checks the password and sets the current user if it is successful', async () => {
    const {
      handler,
      context,
      dependencies: [userRepo, passwordVerifier, currentUserSetter, eventBus],
    } = await buildRequestHandler(LoginCommandHandler, 'LoginCommand', {
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

    await handler.tryHandle(context);

    expect(currentUserSetter.set).toHaveBeenCalledWith(user);
    expect(eventBus.emit).toHaveBeenCalledWith(
      'LoginSuccessfulEvent',
      undefined
    );
  });

  it('checks does not set the current user if it fails, also emits loginfailedevent', async () => {
    const {
      handler,
      context,
      dependencies: [userRepo, passwordVerifier, currentUserSetter, eventBus],
    } = await buildRequestHandler(LoginCommandHandler, 'LoginCommand', {
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

    await handler.tryHandle(context);

    expect(currentUserSetter.set).not.toHaveBeenCalled();
    expect(eventBus.emit).toHaveBeenCalledWith('LoginFailedEvent', undefined);
  });

  it('check does not set the current user if it doesnt exist and emits loginfailedevent', async () => {
    const {
      handler,
      context,
      dependencies: [userRepo, , currentUserSetter, eventBus],
    } = await buildRequestHandler(LoginCommandHandler, 'LoginCommand', {
      username: 'ben',
      password: 'foo',
    });

    when(userRepo.get).calledWith('ben').thenResolve(undefined);

    await handler.tryHandle(context);

    expect(currentUserSetter.set).not.toHaveBeenCalled();
    expect(eventBus.emit).toHaveBeenCalledWith('LoginFailedEvent', undefined);
  });
});
