import type { IKnownCommands } from '@zero/websocket-adapter/client';
import { useCallback, useContext } from 'react';
import { ApiContext } from '@providers';
import type { ICommandParams, IPickCommand } from '@zero/application-core';
import { useNextEvent } from '@hooks';

export const useCommand = <
  TCommand extends IKnownCommands,
  TKey extends TCommand['key']
>(
  key?: TKey,
  options?: { wait: boolean }
) => {
  const { api } = useContext(ApiContext);
  const onComplete = useNextEvent('CommandHandleCompleteEvent');
  const execute = useCallback(
    async <NotUndefined = false>(
      ...params: NotUndefined extends true
        ? [IPickCommand<TCommand, TKey>['params']]
        : ICommandParams<IPickCommand<TCommand, TKey>, NotUndefined>
    ) => {
      if (key) {
        const commandId = await api?.executeCommand<
          TCommand,
          TKey,
          NotUndefined
        >(key, ...params);

        if (options?.wait) {
          await onComplete((data) => data.id === commandId);
        }
      }
    },
    [key, api]
  );

  return { execute };
};
