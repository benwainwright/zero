import { injectable } from 'inversify';
import { multiInject } from './typed-inject.ts';
import type { AbstractQueryHandler } from './abstract-query-handler.ts';
import type { IQuery } from '@types';

@injectable()
export class QueryBus {
  public constructor(
    @multiInject('QueryHandler')
    private readonly handlers: AbstractQueryHandler<IQuery<unknown>>[]
  ) {}

  public async execute<TQuery extends IQuery<unknown>>(
    query: TQuery['query']
  ): Promise<TQuery['response']> {
    const theHandler = this.handlers.find((handler) =>
      handler.canHandle(query)
    );

    return await theHandler?.doHandle({ query });
  }
}
