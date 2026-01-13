import type { IEventBus } from '@ports';
import { AbstractError } from '@zero/bootstrap';

export class AppError extends AbstractError {
  public handle(events: IEventBus) {
    events.emit('ApplicationError', {
      parsedStack: this.parsedStack,
      message: this.message,
    });
  }
}
