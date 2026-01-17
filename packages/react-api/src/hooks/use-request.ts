import type { IKnownRequests } from '@zero/websocket-adapter/client';
import { useCallback, useContext } from 'react';
import { ApiContext } from '@providers';
import type { ExecuteParams } from '@zero/application-core';

export const useRequest = <
  TRequest extends IKnownRequests,
  TKey extends TRequest['key']
>(
  key?: TKey
) => {
  const { api } = useContext(ApiContext);
  const execute = useCallback(
    async <NotUndefined = false>(
      ...params: ExecuteParams<IKnownRequests, TRequest, TKey, NotUndefined>
    ) => {
      if (!key) {
        throw new Error(`Update key was not supplied`);
      }
      return await api?.services.execute<TRequest, TKey, NotUndefined>(
        key,
        ...params
      );
    },
    [key, api]
  );

  return { execute };
};
