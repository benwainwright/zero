import { injectable } from 'inversify';
import type { AbstractCommandHandler } from './abstract-command-handler.ts';
import { inject, multiInject } from './typed-inject.ts';
import type { ICommandBus, ICurrentUserCache } from '@ports';
import type { ICommand } from '@types';

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
    const theHandler = this.handlers.find((handler) =>
      handler.canHandle(command)
    );

    const currentUser = await this.userStore.get();

    await theHandler?.doHandle({
      command: command.params,
      authContext: currentUser,
    });
  }
}
