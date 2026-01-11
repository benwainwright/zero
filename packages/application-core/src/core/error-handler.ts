import type { IEventBus } from '@ports';
import { inject } from './typed-inject.ts';
import { AbstractError, type ILogger } from '@zero/bootstrap';
import { injectable } from 'inversify';

@injectable()
export class ErrorHandler {
  public constructor(
    @inject('EventBus')
    private readonly events: IEventBus,

    @inject('Logger')
    private readonly logger: ILogger
  ) {}

  private handle(error: unknown) {
    if (error instanceof AbstractError) {
      this.logger.error(`${error.message}, ${String(error.stack)}`, {
        error,
      });
      error.handle(this.events);
      return;
    } else if (error instanceof Error) {
      this.logger.error(`${error.message}, ${String(error.stack)}`, {
        error,
      });
    } else {
      this.logger.error(String(error), { error });
    }
  }

  public async withErrorHandling(callback: () => Promise<void>): Promise<void>;
  public withErrorHandling(callback: () => void): void;
  public withErrorHandling(
    callback: (() => Promise<void>) | (() => void)
  ): Promise<void> | void {
    try {
      const response = callback();
      if (response instanceof Promise) {
        return response.catch((error) => {
          this.handle(error);
        });
      }
    } catch (error) {
      this.handle(error);
    }
  }
}
