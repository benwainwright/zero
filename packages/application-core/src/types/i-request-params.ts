import type { IRequest } from './i-query.ts';

export type IRequestParams<
  TRequest extends IRequest<string>,
  NotUndefined = false
> = TRequest extends { params: infer TParams }
  ? NotUndefined extends true
    ? readonly [params: TParams]
    : TParams extends undefined
    ? readonly []
    : readonly [params: TParams]
  : readonly [];
