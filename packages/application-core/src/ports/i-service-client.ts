import type { ExecuteParams, IPickRequest, IRequest } from '@types';

export interface IServiceClient<TRequests extends IRequest<string>> {
  execute<
    TRequest extends TRequests,
    TKey extends TRequest['key'],
    NotUndefined
  >(
    key: TKey,
    ...params: ExecuteParams<TRequests, TRequest, TKey, NotUndefined>
  ): Promise<IPickRequest<TRequest, TKey>['response']>;
}
