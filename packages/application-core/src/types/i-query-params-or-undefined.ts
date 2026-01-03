import { type IQuery } from '@types';

export type IQueryParamsOrUndefined<T extends IQuery<string>> = T extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}
  ? T['params']
  : undefined;
