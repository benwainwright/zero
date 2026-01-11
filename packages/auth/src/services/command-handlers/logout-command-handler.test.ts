import { buildInstance, getCommandContextBuilder } from '@zero/test-helpers';
import { LogoutCommandHandler } from './logout-command-handler.ts';
import type { AuthCommands } from '@services';

const getMockCommandContext = getCommandContextBuilder<AuthCommands>();

describe('logout command handler', () => {
  it('sets the current user to undefined', async () => {
    const [handler, currentUserSetter] = await buildInstance(
      LogoutCommandHandler
    );

    const context = getMockCommandContext('LogoutCommand', undefined);

    await handler.tryHandle(context);

    expect(currentUserSetter.set).toHaveBeenCalledWith(undefined);
  });

  it('emits a logout event', async () => {
    const [handler, , eventBus] = await buildInstance(LogoutCommandHandler);

    const context = getMockCommandContext('LogoutCommand', undefined);

    await handler.tryHandle(context);

    expect(eventBus.emit).toHaveBeenCalledWith(
      'LogoutSuccessfulEvent',
      undefined
    );
  });
});
