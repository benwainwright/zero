import type { IQuery, IQueryContext } from '@types';
import type { AbstractQuery } from './abstract-query.ts';
import { BaseHandler } from './base-handler.ts';

export abstract class AbstractQueryHandler<
  TQuery extends IQuery<unknown>
> extends BaseHandler {
  public abstract canHandle(
    thing: AbstractQuery<string>
  ): thing is TQuery['query'];

  protected abstract handle(
    context: IQueryContext<TQuery['query']>
  ): Promise<TQuery['response']>;

  public async doHandle(
    context: IQueryContext<TQuery['query']>
  ): Promise<TQuery['response']> {
    return await this.handle(context);
  }
}
