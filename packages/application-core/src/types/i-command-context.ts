import type { AbstractCommand } from '@core';

export interface ICommandContext<TCommand extends AbstractCommand<string>> {
  command: TCommand;
}
