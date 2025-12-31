import type { IBaseContext } from './i-base-context.ts';
import type { ICommand } from './i-command.ts';

export interface ICommandContext<TCommand extends ICommand<string>>
  extends IBaseContext {
  command: TCommand['params'];
}
