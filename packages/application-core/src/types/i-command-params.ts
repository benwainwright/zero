import type { ICommandParamsOrUndefined } from './i-command-params-or-undefined.ts';
import type { ICommand } from './i-command.ts';

export type ICommandParams<TCommand extends ICommand<string>> =
  ICommandParamsOrUndefined<TCommand> extends undefined
    ? []
    : [params: ICommandParamsOrUndefined<TCommand>];
