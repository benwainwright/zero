import { mock } from 'vitest-mock-extended';
import { LogoutCommandHandler } from './logout-command-handler.ts';
import { type ICurrentUserSetter } from '@ports';
import { type ILogger } from '@zero/bootstrap';
import { getMockCommandContext } from '@test-helpers';
import { type IAllEvents, type IEventBus } from '@zero/application-core';
import type { IAuthEvents } from '../auth-events.ts';

const getHandler = () => {
  const currentUserSetter = mock<ICurrentUserSetter>();
  const logger = mock<ILogger>();
  const eventBus = mock<IEventBus<IAllEvents & IAuthEvents>>();
  const handler = new LogoutCommandHandler(currentUserSetter, eventBus, logger);
  return { handler, currentUserSetter, eventBus, logger };
};

describe('logout command handler', () => {
  it('sets the current user to undefined', async () => {
    const { currentUserSetter, handler } = getHandler();

    const context = getMockCommandContext('LogoutCommand', undefined);

    await handler.doHandle(context);

    expect(currentUserSetter.set).toHaveBeenCalledWith(undefined);
  });

  it('emits a logout event', async () => {
    const { eventBus, handler } = getHandler();

    const context = getMockCommandContext('LogoutCommand', undefined);

    await handler.doHandle(context);

    expect(eventBus.emit).toHaveBeenCalledWith(
      'LogoutSuccessfulEvent',
      undefined
    );
  });
});
