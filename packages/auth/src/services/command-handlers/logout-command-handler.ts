import {
  AbstractRequestHandler,
  type IAllEvents,
  type IEventBus,
} from '@zero/application-core';
import type { AuthCommands } from '../auth-commands.ts';
import type { ICurrentUserSetter, IGrantManager } from '@ports';
import { inject } from '@core';
import type { ILogger } from '@zero/bootstrap';
import type { AuthEvents } from '@services';

export class LogoutCommandHandler extends AbstractRequestHandler<
  AuthCommands,
  'LogoutCommand'
> {
  public constructor(
    @inject('CurrentUserSetter')
    private readonly currentUserSetter: ICurrentUserSetter,

    @inject('EventBus')
    private readonly eventBus: IEventBus<IAllEvents> & IEventBus<AuthEvents>,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle(): Promise<undefined> {
    this.grants.requiresNoPermissions();

    await this.currentUserSetter.set(undefined);
    this.eventBus.emit('LogoutSuccessfulEvent', undefined);
  }

  public override readonly name = 'LogoutCommand';
}
