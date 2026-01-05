import { injectable } from 'inversify';
import type { AbstractCommandHandler } from './abstract-command-handler.ts';
import { inject, multiInject } from './typed-inject.ts';
import type { ICommandBus, ICurrentUserCache } from '@ports';
import type { ICommand } from '@types';
import { AppError } from '@errors';

@injectable()
export class CommandBus implements ICommandBus {
  public constructor(
    @multiInject('CommandHandler')
    private readonly handlers: AbstractCommandHandler<
      ICommand<string>,
      string
    >[],

    @inject('CurrentUserCache')
    private readonly userStore: ICurrentUserCache
  ) {}

  public async execute(command: ICommand<string>) {
    const currentUser = await this.userStore.get();
    for (const handler of this.handlers) {
      if (await handler.tryHandle({ command, authContext: currentUser })) {
        return;
      }
    }

    throw new AppError(`No handler found for command '${command.key}'`);
  }
}
