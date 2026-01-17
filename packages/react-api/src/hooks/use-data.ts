import type { IPickRequest, IRequestParams } from '@zero/application-core';
import type {
  IKnownRequests,
  IKnownEvents,
} from '@zero/websocket-adapter/client';
import { useDataRequest } from './use-data-request.ts';
import { useEvents } from './use-events.ts';
import { useCallback, useEffect, useState } from 'react';
import { useRequest } from './use-request.ts';

export interface UseDataType {
  <
    TQueryDataKey extends IKnownRequests['key'],
    TUpdaterKey extends IKnownRequests['key'],
    TDataMapper extends (
      queryData: IPickRequest<IKnownRequests, TQueryDataKey>['response']
    ) => IPickRequest<IKnownRequests, TUpdaterKey>['params']
  >(
    config: {
      query: TQueryDataKey;
      refreshOn?: (keyof IKnownEvents)[];
      mapToLocalData: TDataMapper;
      updaterKey: TUpdaterKey;
      load?: boolean;
    },
    ...params: IRequestParams<IPickRequest<IKnownRequests, TQueryDataKey>>
  ): {
    data: ReturnType<TDataMapper>;
    isPending: boolean;
    update: (data: ReturnType<TDataMapper>) => void;
    save: () => Promise<void>;
  };
  <
    TQueryDataKey extends IKnownRequests['key'],
    TDataMapper extends (
      queryData: IPickRequest<IKnownRequests, TQueryDataKey>['response']
    ) => unknown
  >(
    config: {
      query: TQueryDataKey;
      refreshOn?: (keyof IKnownEvents)[];
      mapToLocalData: TDataMapper;
      load?: boolean;
    },
    ...params: IRequestParams<IPickRequest<IKnownRequests, TQueryDataKey>>
  ): {
    data: ReturnType<TDataMapper>;
    isPending: boolean;
  };

  <TQueryDataKey extends IKnownRequests['key']>(
    config: {
      query: TQueryDataKey;
      refreshOn?: (keyof IKnownEvents)[];
      load?: boolean;
    },
    ...params: IRequestParams<IPickRequest<IKnownRequests, TQueryDataKey>>
  ): {
    data: IPickRequest<IKnownRequests, TQueryDataKey>['response'];
    isPending: boolean;
  };
}

export const useData: UseDataType = <
  TData extends IKnownRequests,
  TUpdater extends IKnownRequests,
  TQueryDataKey extends TData['key'],
  TUpdaterKey extends TUpdater['key'],
  TLocalData extends IPickRequest<TUpdater, TUpdaterKey>['params'],
  TDataMapper extends
    | ((
        queryData: IPickRequest<TData, TQueryDataKey>['response'] | undefined
      ) => TLocalData)
    | undefined
>(
  {
    query,
    updaterKey,
    refreshOn,
    mapToLocalData,
    load = true,
  }: {
    query: TQueryDataKey;
    updaterKey?: TUpdaterKey;
    refreshOn?: (keyof IKnownEvents)[];
    mapToLocalData?: TDataMapper | undefined;
    load?: boolean;
  },
  ...params: IRequestParams<IPickRequest<TData, TQueryDataKey>>
) => {
  const { execute } = useRequest<TUpdater, TUpdaterKey>(updaterKey);

  const { data, refresh, isPending } = useDataRequest<TData, TQueryDataKey>(
    query,
    load,
    ...params
  );
  const [localData, setLocalData] = useState<{
    mapped?: IPickRequest<TUpdater, TUpdaterKey>['params'] | undefined;
    unmapped?: IPickRequest<TData, TQueryDataKey>['response'] | undefined;
  }>();

  useEffect(() => {
    if (mapToLocalData && data) {
      setLocalData({ mapped: mapToLocalData(data) });
    } else {
      setLocalData({ unmapped: data });
    }
  }, [JSON.stringify(data)]);

  useEvents((event) => {
    console.log({ event });
    console.log('EVENT FIRED');
    if (refreshOn?.includes(event.key)) {
      console.log('REFRESH');
      refresh();
    }
  });

  const hasMap = Boolean(mapToLocalData);

  const update = useCallback(
    (localData: IPickRequest<TUpdater, TUpdaterKey>['params'] | undefined) => {
      if (!mapToLocalData) {
        throw new Error('Need to supply a mapping function');
      }
      setLocalData({ mapped: localData });
    },
    [hasMap]
  );

  const save = useCallback(async () => {
    if (!mapToLocalData) {
      throw new Error('Need to supply a mapping function');
    }
    if (localData && localData.mapped) {
      await execute<true>(localData.mapped);
    }
  }, [mapToLocalData, localData, execute]);

  const finalData = mapToLocalData ? localData?.mapped : localData?.unmapped;

  return {
    save,
    update,
    data: finalData,
    isPending,
  };
};
