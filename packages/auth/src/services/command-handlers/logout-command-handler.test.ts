import { buildRequestHandler } from '@zero/test-helpers';
import { LogoutCommandHandler } from './logout-command-handler.ts';

describe('logout command handler', () => {
  it('sets the current user to undefined', async () => {
    const {
      handler,
      context,
      dependencies: [currentUserSetter],
    } = await buildRequestHandler(
      LogoutCommandHandler,
      'LogoutCommand',
      undefined
    );

    await handler.tryHandle(context);

    expect(currentUserSetter.set).toHaveBeenCalledWith(undefined);
  });

  it('emits a logout event', async () => {
    const {
      handler,
      context,
      dependencies: [, eventBus],
    } = await buildRequestHandler(
      LogoutCommandHandler,
      'LogoutCommand',
      undefined
    );

    await handler.tryHandle(context);

    expect(eventBus.emit).toHaveBeenCalledWith(
      'LogoutSuccessfulEvent',
      undefined
    );
  });
});
