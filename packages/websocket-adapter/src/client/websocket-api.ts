import type { IKnownCommands, IKnownQueries } from '@types';
import type {
  IApiSurface,
  ICommandClient,
  IEventListener,
  IEventPacket,
  IListener,
  IQueryParamsOrUndefined,
  IQueryClient,
  IQueryParams,
  ICommandParams,
} from '@zero/application-core';

import type { AuthCommands, AuthQueries } from '@zero/auth';
import { injectable } from 'inversify';
import { inject } from './typed-inject.ts';
import type { IKnownEvents } from './i-known-events.ts';

@injectable()
export class WebsocketApi
  implements IApiSurface<IKnownCommands, IKnownQueries, IKnownEvents>
{
  public constructor(
    @inject('CommandClient')
    private readonly commandClient: ICommandClient<IKnownCommands>,

    @inject('QueryClient')
    private readonly queryClient: IQueryClient<IKnownQueries>,

    @inject('EventListener')
    private eventBus: IEventListener<IKnownEvents>
  ) {}

  public removeAll() {
    return this.eventBus.removeAll();
  }

  public off(identifier: string) {
    this.eventBus.off(identifier);
  }

  public onAll(callback: IListener<IKnownEvents>) {
    return this.eventBus.onAll(callback);
  }

  public on<TKey extends keyof IKnownEvents>(
    key: TKey,
    callback: (data: IEventPacket<IKnownEvents, TKey>['data']) => void
  ): string {
    return this.eventBus.on(key, callback);
  }

  public async executeCommand<
    TCommand extends AuthCommands,
    TKey extends TCommand['key']
  >(key: TKey, ...params: ICommandParams<TCommand>): Promise<void> {
    await this.commandClient.execute(key, ...params);
  }

  public async executeQuery<
    TQuery extends AuthQueries,
    TKey extends TQuery['key']
  >(key: TKey, ...params: IQueryParams<TQuery>): Promise<TQuery['response']> {
    return await this.queryClient.execute(key, ...params);
  }
}
