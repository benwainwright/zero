import { Command } from './command.ts';
import type { IServiceContext } from './i-service-context.ts';

export abstract class AbstractService<TCommand extends Command> {
  public abstract canHandle(thing: unknown): thing is TCommand;

  protected abstract handle(context: IServiceContext<TCommand>): Promise<void>;

  public async doHandle(context: IServiceContext<TCommand>): Promise<void> {
    await this.handle(context);
  }
}
