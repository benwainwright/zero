import { useContext, useEffect, useState, useTransition } from 'react';
import { ApiContext } from '@providers';
import type { IPickRequest, IRequestParams } from '@zero/application-core';
import type { IKnownRequests } from '@zero/websocket-adapter/client';

export const useDataRequest = <
  TRequest extends IKnownRequests,
  TKey extends TRequest['key']
>(
  key: TKey,
  load = true,
  ...params: IRequestParams<IPickRequest<TRequest, TKey>>
): {
  data: IPickRequest<TRequest, TKey>['response'] | undefined;
  isPending: boolean;
  refresh: () => void;
} => {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<IPickRequest<TRequest, TKey>['response']>();
  const [dirty, setDirty] = useState(true);
  const { api } = useContext(ApiContext);

  useEffect(() => {
    if (load) {
      startTransition(async () => {
        (async () => {
          if (api && dirty) {
            setData(await api.services.execute(key, ...params));
            setDirty(false);
          }
        })();
      });
    }
  }, [api, dirty, load]);

  const refresh = () => {
    setDirty(true);
  };

  return { isPending, data, refresh };
};
