import {
  AbstractCommandHandler,
  type IAllEvents,
  type IEventBus,
} from '@zero/application-core';
import type { AuthCommands } from '../auth-commands.ts';
import type { ICurrentUserSetter } from '@ports';
import { inject } from '@core';
import type { ILogger } from '@zero/bootstrap';
import type { IAuthEvents } from '../auth-events.ts';

export class LogoutCommandHandler extends AbstractCommandHandler<
  AuthCommands,
  'LogoutCommand'
> {
  public constructor(
    @inject('CurrentUserSetter')
    private readonly currentUserSetter: ICurrentUserSetter,

    @inject('EventBus')
    private readonly eventBus: IEventBus<IAllEvents & IAuthEvents>,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle(): Promise<void> {
    await this.currentUserSetter.set(undefined);
    this.eventBus.emit('LogoutSuccessfulEvent', undefined);
  }

  public override readonly name = 'LogoutCommand';
}
