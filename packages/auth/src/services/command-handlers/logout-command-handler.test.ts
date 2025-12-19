import { LogoutCommandHandler } from './logout-command-handler.ts';
import { buildCommandHandler, getMockCommandContext } from '@test-helpers';

describe('logout command handler', () => {
  it('sets the current user to undefined', async () => {
    const { currentUserSetter, handler } =
      buildCommandHandler(LogoutCommandHandler);

    const context = getMockCommandContext('LogoutCommand', undefined);

    await handler.doHandle(context);

    expect(currentUserSetter.set).toHaveBeenCalledWith(undefined);
  });

  it('emits a logout event', async () => {
    const { eventBus, handler } = buildCommandHandler(LogoutCommandHandler);

    const context = getMockCommandContext('LogoutCommand', undefined);

    await handler.doHandle(context);

    expect(eventBus.emit).toHaveBeenCalledWith(
      'LogoutSuccessfulEvent',
      undefined
    );
  });
});
