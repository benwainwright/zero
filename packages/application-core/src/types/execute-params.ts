import type { IPickRequest, IRequest, IRequestParams } from '@types';

export type ExecuteParams<
  TRequests extends IRequest<string>,
  TRequest extends TRequests,
  TKey extends TRequest['key'],
  NotUndefined
> = NotUndefined extends true
  ? [IPickRequest<TRequest, TKey>['params']]
  : IRequestParams<IPickRequest<TRequest, TKey>, NotUndefined>;
