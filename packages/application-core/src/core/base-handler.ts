import type { ILogger } from '@zero/bootstrap';

export abstract class BaseHandler<TKey extends string> {
  public constructor(protected readonly logger: ILogger) {}

  public abstract readonly name: TKey;
}
