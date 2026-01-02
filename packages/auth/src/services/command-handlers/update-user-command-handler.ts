import {
  AbstractCommandHandler,
  type ICommandContext,
  type IPickCommand,
} from '@zero/application-core';
import type { AuthCommands } from '../auth-commands.ts';
import type {
  IGrantManager,
  IPasswordHasher,
  IRoleRepository,
  IUserRepository,
} from '@ports';
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

    @inject('RoleRepository')
    private roleRepo: IRoleRepository,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    command: { username, email, password, roles },
  }: ICommandContext<
    IPickCommand<AuthCommands, 'UpdateUserCommand'>
  >): Promise<void> {
    const user = await this.userRepo.getUser(username);

    const allRoles = await Promise.all(
      roles.map(async (role) => await this.roleRepo.requireRole(role))
    );

    this.grants.requires({
      capability: 'user:update',
      for: user,
    });

    this.grants.requires({
      capability: 'user:read',
      for: user,
    });

    this.grants.requires({
      capability: 'role:list',
    });

    if (!user) {
      throw new UserNotFoundError(`Could not find user ${username}`);
    }

    const hash = await this.passwordHasher.hashPassword(password);

    user.update({
      email,
      hash,
      roles: allRoles,
    });

    await this.userRepo.saveUser(user);
  }
}
