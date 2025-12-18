import type { AbstractCommand } from '@core';

export interface ICommandBus {
  execute(command: AbstractCommand<string>): Promise<void>;
}
