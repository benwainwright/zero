import type { IEventBus, IPickRequest, IRequest } from '@zero/application-core';
import { User } from '@zero/domain';
import { mock } from 'vitest-mock-extended';

export const getRequestContextBuilder =
  <TRequest extends IRequest<string>>() =>
  <TKey extends TRequest['key']>(
    key: TKey,
    params: IPickRequest<TRequest, TKey>['params'],
    user?: string
  ): {
    authContext: User | undefined;
    events: IEventBus;
    params: {
      id: string;
      key: TKey;
      params: IPickRequest<TRequest, TKey>['params'];
    };
  } => {
    const authContext = user ? mock<User>({ id: user }) : undefined;

    return {
      params: { id: 'foo-bar', key: key, params },
      authContext,
      events: mock<IEventBus>(),
    };
  };
