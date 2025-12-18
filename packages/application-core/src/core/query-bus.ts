import { injectable } from 'inversify';
import { inject, multiInject } from './typed-inject.ts';
import type { AbstractQueryHandler } from './abstract-query-handler.ts';
import type { IQuery } from '@types';
import type { ICurrentUserCache } from '@ports';

@injectable()
export class QueryBus {
  public constructor(
    @multiInject('QueryHandler')
    private readonly handlers: AbstractQueryHandler<IQuery<string>, string>[],
    @inject('CurrentUserCache')
    private readonly userStore: ICurrentUserCache
  ) {}

  public async execute<TQuery extends IQuery<string>>(
    query: TQuery['query']
  ): Promise<TQuery['response']> {
    const theHandler = this.handlers.find((handler) =>
      handler.canHandle(query)
    );

    const currentUser = await this.userStore.get();

    return await theHandler?.doHandle({
      query: query.params,
      authContext: currentUser,
    });
  }
}
