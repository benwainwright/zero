import type { ICommand, ICommandContext, IPickCommand } from '@types';
import { BaseHandler } from './base-handler.ts';
import type { User } from '@zero/domain';

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
  }: {
    command: Omit<ICommand<string>, 'response'>;
    authContext: User | undefined;
  }): Promise<boolean> {
    if (!this.canHandle(command)) {
      return false;
    }

    await this.handle({
      command: command.params,
      authContext,
      id: command.id,
    });

    return true;
  }
}
