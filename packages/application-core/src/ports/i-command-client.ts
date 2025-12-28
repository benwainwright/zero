import type { ICommand } from '@types';

export interface ICommandClient<TCommand extends ICommand<string>> {
  execute(command: Omit<TCommand, 'id'>): Promise<void>;
}
