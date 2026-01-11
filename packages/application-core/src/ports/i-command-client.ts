import type {
  ICommand,
  ICommandParams,
  IExtractParams,
  IPickCommand,
} from '@types';

export interface ICommandClient<TCommands extends ICommand<string>> {
  execute<
    TCommand extends TCommands,
    TKey extends TCommand['key'],
    NotUndefined = true
  >(
    key: TKey,
    ...params: NotUndefined extends true
      ? [IExtractParams<TCommand>]
      : ICommandParams<IPickCommand<TCommands, TKey>, NotUndefined>
  ): Promise<string>;
}
