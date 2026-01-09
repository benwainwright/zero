import type { AbstractCommandHandler } from '@core';
import type { ICommand } from '@types';

export interface ICommandBus {
  onHandler?: (
    callback: (bus: AbstractCommandHandler<ICommand<string>, string>) => void
  ) => void;

  execute(command: ICommand<string>): Promise<void>;
}
