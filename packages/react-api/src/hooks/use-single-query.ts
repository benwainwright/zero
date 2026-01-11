import type { IKnownQueries } from '@zero/websocket-adapter/client';
import { useCallback, useContext } from 'react';
import { ApiContext } from '@providers';
import type { IPickQuery, IQueryParams } from '@zero/application-core';

export const useSingleQuery = <
  TQuery extends IKnownQueries,
  TKey extends TQuery['key']
>(
  key: TKey
) => {
  const { api } = useContext(ApiContext);
  const query = useCallback(
    async (...params: IQueryParams<IPickQuery<TQuery, TKey>>) => {
      return await api?.executeQuery<TQuery, TKey>(key, ...params);
    },
    [key, api]
  );

  return { query };
};
