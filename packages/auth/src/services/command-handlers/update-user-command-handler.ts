import {
  AbstractCommandHandler,
  type ICommandContext,
} from '@zero/application-core';
import type { AuthCommands } from '../auth-commands.ts';
import type { IGrantManager, IPasswordHasher, IUserRepository } from '@ports';
import { injectable } from 'inversify';
import { inject, UserNotFoundError } from '@core';
import type { ILogger } from '@zero/bootstrap';

@injectable()
export class UpdateUserCommandHandler extends AbstractCommandHandler<
  AuthCommands,
  'UpdateUserCommand'
> {
  public override readonly name = 'UpdateUserCommand';

  public constructor(
    @inject('UserRepository')
    private userRepo: IUserRepository,

    @inject('PasswordHasher')
    private passwordHasher: IPasswordHasher,

    @inject('GrantService')
    private grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    command: { username, email, password },
  }: ICommandContext<AuthCommands, 'UpdateUserCommand'>): Promise<void> {
    const user = await this.userRepo.getUser(username);

    this.grants.requires({
      capability: 'user:update',
      for: user,
    });

    if (!user) {
      throw new UserNotFoundError(`Could not find user ${username}`);
    }

    const hash = await this.passwordHasher.hashPassword(password);

    user.update({
      email,
      hash,
    });

    await this.userRepo.saveUser(user);
  }
}
