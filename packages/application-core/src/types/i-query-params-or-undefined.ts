import { type IQuery } from '@types';

export type IQueryParamsOrUndefined<T extends IQuery<string>> = T extends {
  params: any;
}
  ? T['params']
  : undefined;
