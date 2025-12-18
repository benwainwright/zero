import type { ICommand } from '@types';

export interface ICommandBus {
  execute(command: ICommand<string>): Promise<void>;
}
