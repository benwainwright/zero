import type { IKnownCommands } from '@zero/websocket-adapter/client';
import { useContext } from 'react';
import { ApiContext } from '@providers';
import type { ICommandParams, IPickCommand } from '@zero/application-core';

export const useCommand = <
  TCommand extends IKnownCommands,
  TKey extends TCommand['key']
>(
  key?: TKey
) => {
  const { api } = useContext(ApiContext);

  const execute = async <NotUndefined = false>(
    ...params: NotUndefined extends true
      ? [IPickCommand<TCommand, TKey>['params']]
      : ICommandParams<IPickCommand<TCommand, TKey>, NotUndefined>
  ) => {
    if (key) {
      await api?.executeCommand<TCommand, TKey, NotUndefined>(key, ...params);
    }
  };

  return { execute };
};
