import {
  AbstractCommandHandler,
  type IAllEvents,
  type ICommandContext,
  type IEventBus,
} from '@zero/application-core';
import type { AuthCommands } from './auth-commands.ts';
import { injectable } from 'inversify';
import type {
  ICurrentUserSetter,
  IPasswordVerifier,
  IUserRepository,
} from '@ports';
import { inject } from '@core';
import type { IAuthEvents } from './auth-events.ts';

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
    private eventBus: IEventBus<IAllEvents & IAuthEvents>
  ) {
    super();
  }

  protected override async handle({
    command: { username, password },
  }: ICommandContext<AuthCommands, 'LoginCommand'>): Promise<void> {
    const user = await this.userRepo.get(username);

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
