import type {
  IExtractParams,
  IPickCommand,
  IPickQuery,
  IQueryParams,
} from '@zero/application-core';
import type {
  IKnownCommands,
  IKnownEvents,
  IKnownQueries,
} from '@zero/websocket-adapter/client';
import { useQuery } from './use-query.ts';
import { useCommand } from './use-command.ts';
import { useEvents } from './use-events.ts';
import { useCallback, useEffect, useState } from 'react';

export const useData = <
  TQuery extends IKnownQueries,
  TCommand extends IKnownCommands,
  TQueryKey extends TQuery['key'],
  TCommandKey extends TCommand['key'],
  TLocalData extends IPickCommand<TCommand, TCommandKey>['params'],
  TDataMapper extends (
    queryData: IPickQuery<TQuery, TQueryKey>['response'] | undefined
  ) => TLocalData | undefined
>(
  {
    query,
    command,
    refreshOn,
    mapToLocalData,
  }: {
    query: TQueryKey;
    command?: TCommandKey;
    refreshOn?: (keyof IKnownEvents)[];
    mapToLocalData?: TDataMapper;
  },
  ...params: IQueryParams<IPickQuery<TQuery, TQueryKey>>
) => {
  const { execute } = useCommand<TCommand, TCommandKey>(command);
  const { data, refresh, isPending } = useQuery<TQuery, TQueryKey>(
    query,
    ...params
  );
  const [localData, setLocalData] = useState<{
    mapped?: IPickCommand<TCommand, TCommandKey>['params'] | undefined;
    unmapped?: IPickQuery<TQuery, TQueryKey>['response'] | undefined;
  }>();

  useEffect(() => {
    if (mapToLocalData) {
      setLocalData({ mapped: mapToLocalData(data) });
    } else {
      setLocalData({ unmapped: data });
    }
  }, [data]);

  useEvents((event) => {
    if (refreshOn?.includes(event.key)) {
      refresh();
    }
  });

  const update = useCallback(
    (localData: IPickCommand<TCommand, TCommandKey>['params'] | undefined) => {
      if (!mapToLocalData) {
        throw new Error('Need to supply a mapping function');
      }
      setLocalData({ mapped: localData });
    },
    [mapToLocalData]
  );

  const save = useCallback(async () => {
    if (!mapToLocalData) {
      throw new Error('Need to supply a mapping function');
    }
    if (localData && localData.mapped) {
      await execute<true>(localData.mapped);
    }
  }, [mapToLocalData, localData, execute]);

  const finalData = (
    mapToLocalData ? localData?.mapped : localData?.unmapped
  ) as IExtractParams<IKnownCommands> extends TLocalData
    ? IPickQuery<TQuery, TQueryKey>['response']
    : IPickCommand<TCommand, TCommandKey>['params'];

  return {
    save,
    update,
    data: finalData,
    isPending,
  };
};
