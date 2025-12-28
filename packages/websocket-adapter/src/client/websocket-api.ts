import type {
  IKnownCommands,
  IKnownQueries,
  IQueryResponseEvent,
} from '@types';
import type {
  IAllEvents,
  IApiSurface,
  ICommandClient,
  IEventListener,
  IEventPacket,
  IListener,
  IQueryClient,
} from '@zero/application-core';
import type { AuthCommands, AuthQueries } from '@zero/auth';
import { injectable } from 'inversify';
import { inject } from './typed-inject.ts';

@injectable()
export class WebsocketApi
  implements
    IApiSurface<
      IKnownCommands,
      IKnownQueries,
      IAllEvents & IQueryResponseEvent
    >
{
  public constructor(
    @inject('CommandClient')
    private readonly commandClient: ICommandClient<IKnownCommands>,

    @inject('QueryClient')
    private readonly queryClient: IQueryClient<IKnownQueries>,

    @inject('EventListener')
    private eventBus: IEventListener<IAllEvents & IQueryResponseEvent>
  ) {}

  public removeAll() {
    return this.eventBus.removeAll();
  }

  public off(identifier: string) {
    this.eventBus.off(identifier);
  }

  public onAll(callback: IListener<IAllEvents & IQueryResponseEvent>) {
    return this.eventBus.onAll(callback);
  }

  public on<TKey extends keyof (IAllEvents & IQueryResponseEvent)>(
    key: TKey,
    callback: (
      data: IEventPacket<IAllEvents & IQueryResponseEvent, TKey>['data']
    ) => void
  ): string {
    return this.eventBus.on(key, callback);
  }

  public async executeCommand(
    command: Omit<AuthCommands, 'id'>
  ): Promise<void> {
    await this.commandClient.execute(command);
  }

  public async executeQuery<TQuery extends AuthQueries>(
    query: Omit<TQuery['query'], 'id'>
  ): Promise<TQuery['response']> {
    return await this.queryClient.execute(query);
  }
}
