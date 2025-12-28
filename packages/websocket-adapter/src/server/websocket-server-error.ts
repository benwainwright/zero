import { AbstractError } from '@zero/bootstrap';
import type { IAllEvents } from '@zero/application-core';

interface IEventEmitter {
  emit<TKey extends keyof IAllEvents>(key: TKey, data: IAllEvents[TKey]): void;
}

export class WebsocketServerError extends AbstractError {
  public override handle(events: IEventEmitter) {
    events.emit('ApplicationError', {
      stack: this.parsedStack,
      message: this.message,
    });
  }
}
