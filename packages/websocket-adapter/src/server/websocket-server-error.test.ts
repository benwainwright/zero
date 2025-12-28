import { mock } from 'vitest-mock-extended';
import { WebsocketServerError } from './websocket-server-error.ts';
import { type IEventBus } from '@zero/application-core';

describe('websocket server error.handle', () => {
  it('emits an event on the event bus', () => {
    const error = new WebsocketServerError('foo');

    const bus = mock<IEventBus>();

    error.handle(bus);

    expect(bus.emit).toHaveBeenCalled();
  });
});
