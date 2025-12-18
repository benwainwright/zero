import { AbstractCommand } from './abstract-command.ts';
import type { ICommandContext } from '@types';
import { BaseHandler } from './base-handler.ts';

export abstract class AbstractCommandHandler<
  TCommand extends AbstractCommand<string>
> extends BaseHandler {
  public abstract canHandle(thing: AbstractCommand<string>): thing is TCommand;

  protected abstract handle(context: ICommandContext<TCommand>): Promise<void>;

  public async doHandle(context: ICommandContext<TCommand>): Promise<void> {
    await this.handle(context);
  }
}
