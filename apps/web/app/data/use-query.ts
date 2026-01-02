import { useContext, useEffect, useState, useTransition } from 'react';
import { ApiContext } from './api-provider.tsx';
import type { IKnownQueries } from '@zero/websocket-adapter/client';
import type { IPickQuery, IQueryParams } from '@zero/application-core';

export const useQuery = <
  TQuery extends IKnownQueries,
  TKey extends TQuery['key']
>(
  key: TKey,
  ...params: IQueryParams<IPickQuery<TQuery, TKey>>
) => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<IPickQuery<TQuery, TKey>['response']>();
  const [dirty, setDirty] = useState(true);
  const { api } = useContext(ApiContext);

  useEffect(() => {
    startTransition(async () => {
      (async () => {
        if (api && dirty) {
          setData(await api.executeQuery(key, ...params));
          setDirty(false);
        }
      })();
    });
  }, [api, dirty]);

  const refresh = () => {
    setDirty(true);
  };

  return { isPending, data, refresh };
};
