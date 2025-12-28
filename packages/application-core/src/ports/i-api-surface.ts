import type { ICommand, IEventPacket, IQuery } from '@types';
import type { IListener } from './i-event-listener.ts';

export interface IApiSurface<
  TCommands extends ICommand<string>,
  TQueries extends IQuery<string>,
  TEvents
> {
  executeCommand(command: Omit<TCommands, 'id'>): Promise<void>;

  executeQuery<TQuery extends TQueries>(
    query: Omit<TQuery['query'], 'id'>
  ): Promise<TQuery['response']>;

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
