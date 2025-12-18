import type { ICommand, ICommandContext, IPickCommand } from '@types';
import { BaseHandler } from './base-handler.ts';

export abstract class AbstractCommandHandler<
  TCommands extends ICommand<string>,
  TKey extends TCommands['key']
> extends BaseHandler<TKey> {
  public canHandle(
    thing: ICommand<string>
  ): thing is IPickCommand<TCommands, TKey> {
    return thing.key === this.name;
  }

  protected abstract handle(
    context: ICommandContext<TCommands, TKey>
  ): Promise<void>;

  public async doHandle(
    context: ICommandContext<TCommands, TKey>
  ): Promise<void> {
    await this.handle(context);
  }
}
