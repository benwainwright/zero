import type { IEventBus } from '@zero/application-core';
import { AbstractError } from '@zero/bootstrap';
import type { IntegrationEvents } from '../adapter-events.ts';

export class HttpError extends AbstractError {
  public constructor(
    message: string,
    public readonly statusCode: number,
    public readonly body: string,
    public readonly requestId: string
  ) {
    super(message);
  }

  public override handle(events: IEventBus<IntegrationEvents>): void {
    events.emit('HttpError', {
      time: new Date(),
      statusCode: this.statusCode,
      body: this.body,
      parsedStack: this.parsedStack,
      requestId: this.requestId,
    });
  }
}
