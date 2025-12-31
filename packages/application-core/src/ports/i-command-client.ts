import type { ICommand, ICommandParams } from '@types';

export interface ICommandClient<TCommands extends ICommand<string>> {
  execute<TCommand extends TCommands, TKey extends TCommand['key']>(
    key: TKey,
    ...params: ICommandParams<TCommand>
  ): Promise<void>;
}
