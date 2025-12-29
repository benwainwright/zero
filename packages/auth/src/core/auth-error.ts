import type { IEventEmitter } from '@zero/application-core';
import { AbstractError } from '@zero/bootstrap';

export class AuthError extends AbstractError {
  public override handle(events: IEventEmitter): void {
    events.emit('ApplicationError', {
      stack: this.parsedStack,
      message: this.message,
    });
  }

  public constructor(message: string) {
    super(message);
  }
}
