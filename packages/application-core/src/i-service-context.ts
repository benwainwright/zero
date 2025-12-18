import type { Command } from './command.ts';

export interface IServiceContext<TCommand extends Command> {
  command: TCommand;
}
