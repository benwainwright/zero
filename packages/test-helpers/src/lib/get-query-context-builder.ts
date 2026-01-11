import type { IEventBus, IPickQuery, IQuery } from '@zero/application-core';
import { User } from '@zero/domain';
import { mock } from 'vitest-mock-extended';

export const getQueryContextBuilder =
  <TQuery extends IQuery<string>>() =>
  <TKey extends TQuery['key']>(
    key: TKey,
    params: IPickQuery<TQuery, TKey>['params'],
    user?: string
  ): {
    authContext: User | undefined;
    events: IEventBus;
    query: {
      id: string;
      key: TKey;
      params: IPickQuery<TQuery, TKey>['params'];
    };
  } => {
    const authContext = user ? mock<User>({ id: user }) : undefined;

    return {
      query: { id: 'foo-bar', key: key, params },
      authContext,
      events: mock<IEventBus>(),
    };
  };
