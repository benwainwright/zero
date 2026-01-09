import type { ICommand, IPickCommand } from '@zero/application-core';
import { User } from '@zero/domain';
import { mock } from 'vitest-mock-extended';

export const getCommandContextBuilder =
  <TCommand extends ICommand<string>>() =>
  <TKey extends TCommand['key']>(
    key: TKey,
    params: IPickCommand<TCommand, TKey>['params'],
    user?: string
  ): {
    authContext: User | undefined;
    command: {
      id: string;
      key: TKey;
      params: IPickCommand<TCommand, TKey>['params'];
    };
  } => {
    const authContext = user ? mock<User>({ id: user }) : undefined;

    return {
      command: { id: 'foo-bar', key: key, params },
      authContext,
    };
  };
