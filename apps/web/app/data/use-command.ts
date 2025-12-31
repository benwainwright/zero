import type { IKnownCommands } from '@zero/websocket-adapter/client';
import { useContext } from 'react';
import { ApiContext } from './api-provider.tsx';
import type { ICommandParams, IPickCommand } from '@zero/application-core';

export const useCommand = <
  TCommand extends IKnownCommands,
  TKey extends TCommand['key']
>(
  key: TKey
) => {
  const { api } = useContext(ApiContext);

  const execute = async (
    ...params: ICommandParams<IPickCommand<TCommand, TKey>>
  ) => {
    await api?.executeCommand(key, ...params);
  };

  return { execute };
};
