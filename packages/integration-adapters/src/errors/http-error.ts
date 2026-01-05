import type { IEventBus } from '@zero/application-core';
import { AbstractError } from '@zero/bootstrap';
import type { AdapterEvents } from '../adapter-events.ts';

export class HttpError extends AbstractError {
  public constructor(
    message: string,
    private statusCode: number,
    private body: string
  ) {
    super(message);
  }

  public override handle(events: IEventBus<AdapterEvents>): void {
    events.emit('HttpError', {
      statusCode: this.statusCode,
      body: this.body,
    });
  }
}
