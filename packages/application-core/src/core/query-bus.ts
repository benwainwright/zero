import { injectable } from 'inversify';
import { inject, multiInject } from './typed-inject.ts';
import type { AbstractQueryHandler } from './abstract-query-handler.ts';
import type { IQuery } from '@types';
import type { ICurrentUserCache, IQueryBus } from '@ports';
import { AppError } from '@errors';

@injectable()
export class QueryBus<IQueries extends IQuery<string>> implements IQueryBus {
  public constructor(
    @multiInject('QueryHandler')
    private readonly handlers: AbstractQueryHandler<IQueries, string>[],

    @inject('CurrentUserCache')
    private readonly userStore: ICurrentUserCache
  ) {}

  public async execute<TQuery extends IQuery<string>>(
    query: Omit<TQuery, 'response'>
  ): Promise<TQuery['response']> {
    const currentUser = await this.userStore.get();
    for (let handler of this.handlers) {
      const result = await handler.tryHandle({
        query,
        authContext: currentUser,
      });
      if (result.handled) {
        return result.response;
      }
    }

    throw new AppError(`No handler found for query '${query.key}'`);
  }
}
