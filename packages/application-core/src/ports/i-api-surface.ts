import type {
  ICommand,
  ICommandParams,
  IEventPacket,
  IPickCommand,
  IPickQuery,
  IQuery,
  IQueryParams,
} from '@types';
import type { IListener } from './i-event-listener.ts';

export interface IApiSurface<
  TCommands extends ICommand<string>,
  TQueries extends IQuery<string>,
  TEvents
> {
  executeCommand<
    TCommand extends TCommands,
    TKey extends TCommand['key'],
    NotUndefined = true
  >(
    key: TKey,
    ...params: NotUndefined extends true
      ? [IPickCommand<TCommand, TKey>['params']]
      : ICommandParams<IPickCommand<TCommands, TKey>, NotUndefined>
  ): Promise<string>;

  executeQuery<TQuery extends TQueries, TKey extends TQuery['key']>(
    key: TKey,
    ...params: IQueryParams<IPickQuery<TQuery, TKey>>
  ): Promise<IPickQuery<TQuery, TKey>['response']>;

  on<TKey extends keyof TEvents>(
    key: TKey,
    callback: (
      data: IEventPacket<TEvents, TKey>['data']
    ) => void | Promise<void>
  ): string;

  onAll(callback: IListener<TEvents>): string;

  off(identifier: string): void;

  removeAll(): void;
}
