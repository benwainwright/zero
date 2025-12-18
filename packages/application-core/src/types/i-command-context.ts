import type { IBaseContext } from './i-base-context.ts';
import type { ICommand } from './i-command.ts';
import type { IPickCommand } from './i-pick-command.ts';

export interface ICommandContext<
  TCommands extends ICommand<string>,
  TKey extends TCommands['key']
> extends IBaseContext {
  command: IPickCommand<TCommands, TKey>['params'];
}
