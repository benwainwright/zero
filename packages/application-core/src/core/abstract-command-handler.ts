import type { ICommand, ICommandContext, IPickCommand } from '@types';
import { BaseHandler } from './base-handler.ts';
import type { User } from '@zero/domain';
import type { IEventBus } from '@ports';

export abstract class AbstractCommandHandler<
  TCommands extends ICommand<string>,
  TKey extends TCommands['key']
> extends BaseHandler<TKey> {
  protected canHandle(
    thing: Omit<ICommand<string>, 'response'>
  ): thing is IPickCommand<TCommands, TKey> {
    return thing.key === this.name;
  }

  protected abstract handle(
    context: ICommandContext<IPickCommand<TCommands, TKey>>
  ): Promise<void>;

  public async tryHandle({
    command,
    authContext,
    events,
  }: {
    command: Omit<ICommand<string>, 'response'>;
    authContext: User | undefined;
    events: IEventBus;
  }): Promise<boolean> {
    if (!this.canHandle(command)) {
      return false;
    }
    try {
      events.emit('CommandHandleStartEvent', {
        key: this.name,
        id: command.id,
      });

      await this.handle({
        command: command.params,
        authContext,
        id: command.id,
      });
    } finally {
      events.emit('CommandHandleCompleteEvent', {
        key: this.name,
        id: command.id,
      });
    }

    return true;
  }
}
