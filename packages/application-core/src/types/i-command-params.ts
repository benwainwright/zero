import type { ICommand } from './i-command.ts';

export type ICommandParams<
  TCommand extends ICommand<string>,
  NotUndefined = false
> = TCommand extends { params: infer TParams }
  ? NotUndefined extends true
    ? readonly [params: TParams]
    : TParams extends undefined
    ? readonly []
    : readonly [params: TParams]
  : readonly [];
