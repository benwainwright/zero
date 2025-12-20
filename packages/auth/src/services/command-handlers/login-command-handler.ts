import {
  AbstractCommandHandler,
  type IAllEvents,
  type ICommandContext,
  type IEventBus,
} from '@zero/application-core';
import type { AuthCommands } from '../auth-commands.ts';
import { injectable } from 'inversify';
import type {
  ICurrentUserSetter,
  IGrantManager,
  IPasswordVerifier,
  IUserRepository,
} from '@ports';
import { inject } from '@core';
import type { IAuthEvents } from '../auth-events.ts';
import type { ILogger } from '@zero/bootstrap';

@injectable()
export class LoginCommandHandler extends AbstractCommandHandler<
  AuthCommands,
  'LoginCommand'
> {
  public override readonly name = 'LoginCommand';

  public constructor(
    @inject('UserRepository')
    private readonly userRepo: IUserRepository,

    @inject('PasswordVerifier')
    private readonly passwordVerifier: IPasswordVerifier,

    @inject('CurrentUserSetter')
    private currentUserSetter: ICurrentUserSetter,

    @inject('EventBus')
    private eventBus: IEventBus<IAllEvents & IAuthEvents>,

    @inject('GrantService')
    private grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    command: { username, password },
  }: ICommandContext<AuthCommands, 'LoginCommand'>): Promise<void> {
    this.grants.requiresNoPermissions();

    const user = await this.userRepo.getUser(username);

    if (
      user &&
      (await this.passwordVerifier.verifyPassword(password, user.passwordHash))
    ) {
      this.eventBus.emit('LoginSuccessfulEvent', undefined);
      await this.currentUserSetter.set(user);
    } else {
      this.eventBus.emit('LoginFailedEvent', undefined);
    }
  }
}
