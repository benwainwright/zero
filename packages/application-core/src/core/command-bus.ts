import { injectable } from 'inversify';
import type { AbstractCommandHandler } from './abstract-command-handler.ts';
import type { AbstractCommand } from './abstract-command.ts';
import { multiInject } from './typed-inject.ts';
import type { ICommandBus } from '@ports';

@injectable()
export class CommandBus implements ICommandBus {
  public constructor(
    @multiInject('CommandHandler')
    private readonly handlers: AbstractCommandHandler<AbstractCommand<string>>[]
  ) {}

  public async execute(command: AbstractCommand<string>) {
    const theHandler = this.handlers.find((handler) =>
      handler.canHandle(command)
    );

    await theHandler?.doHandle({ command });
  }
}
