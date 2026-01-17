import type { IRequest } from './i-query.ts';
import type { IBaseContext } from './i-base-context.ts';

export interface IRequestContext<TQuery extends IRequest<string>>
  extends IBaseContext {
  params: TQuery['params'];
}
