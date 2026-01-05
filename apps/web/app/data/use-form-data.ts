import { useForm } from '@mantine/form';
import type {
  IPickCommand,
  IPickQuery,
  IQueryParams,
} from '@zero/application-core';
import { useData } from '@zero/react-api';
import type {
  IKnownCommands,
  IKnownEvents,
  IKnownQueries,
} from '@zero/websocket-adapter/client';
import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Validate<T extends Record<string, any>> = Exclude<
  Parameters<typeof useForm<T>>[number],
  undefined
>['validate'];

export const useFormData = <
  TQuery extends IKnownQueries,
  TCommand extends IKnownCommands,
  TQueryKey extends TQuery['key'],
  TCommandKey extends TCommand['key'],
  TLocalData extends IPickCommand<TCommand, TCommandKey>['params'] &
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, any>,
  TDataMapper extends (
    queryData: IPickQuery<TQuery, TQueryKey>['response'] | undefined
  ) => TLocalData | undefined
>(
  config: {
    query: TQueryKey;
    command?: TCommandKey;
    refreshOn?: (keyof IKnownEvents)[];
    mapToLocalData?: TDataMapper;
    validate?: Validate<TLocalData>;
  },
  ...params: IQueryParams<IPickQuery<TQuery, TQueryKey>>
) => {
  const input = config.validate ? { validate: config.validate } : undefined;
  const form = useForm(input);

  const { data, isPending } = useData<
    TQuery,
    TCommand,
    TQueryKey,
    TCommandKey,
    TLocalData,
    TDataMapper
  >(config, ...params);

  useEffect(() => {
    if (!isPending && data && form) {
      form.setValues(data);
      form.resetDirty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, JSON.stringify(data)]);
};
