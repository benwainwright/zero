import { type IRequest } from '@types';

export type IQueryParamsOrUndefined<T extends IRequest<string>> = T extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}
  ? T['params']
  : undefined;
