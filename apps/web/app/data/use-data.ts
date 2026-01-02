import type { IPickQuery, IQueryParams } from '@zero/application-core';
import type {
  IKnownCommands,
  IKnownEvents,
  IKnownQueries,
} from '@zero/websocket-adapter/client';
import { useQuery } from './use-query.ts';
import { useCommand } from './use-command.ts';
import { useEvents } from './use-events.ts';

export const useData = <
  TQuery extends IKnownQueries,
  TCommand extends IKnownCommands,
  TQueryKey extends TQuery['key'],
  TCommandKey extends TCommand['key']
>(
  {
    query,
    command,
    refreshOn,
  }: {
    query: TQueryKey;
    command?: TCommandKey;
    refreshOn?: (keyof IKnownEvents)[];
  },
  ...params: IQueryParams<IPickQuery<TQuery, TQueryKey>>
) => {
  const { execute: update } = useCommand(command);
  const { data, refresh, isPending } = useQuery(query, ...params);

  useEvents((event) => {
    if (refreshOn?.includes(event.key)) {
      refresh();
    }
  });

  return { update, data, isPending };
};
