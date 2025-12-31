import type { ICommand } from './i-command.ts';

export type ICommandParams<TCommand extends ICommand<string>> =
  TCommand extends { params: infer TParams }
    ? TParams extends undefined
      ? readonly []
      : readonly [params: TParams]
    : readonly [];
