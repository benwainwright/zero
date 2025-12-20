import {
  AbstractCommandHandler,
  type ICommandContext,
} from '@zero/application-core';
import type {
  IGrantManager,
  IPasswordHasher,
  IRoleRepository,
  IUserRepository,
} from '@ports';
import { injectable } from 'inversify';
import { AuthError, inject } from '@core';
import type { AuthCommands } from '../auth-commands.ts';
import type { ILogger } from '@zero/bootstrap';
import { User } from '@zero/domain';
import { USER_ROLE_ID } from '@constants';

@injectable()
export class CreateUserCommandHandler extends AbstractCommandHandler<
  AuthCommands,
  'CreateUserCommand'
> {
  public override readonly name = 'CreateUserCommand';

  public constructor(
    @inject('UserRepository')
    private readonly userRepo: IUserRepository,

    @inject('RoleRepository')
    private readonly roleRepo: IRoleRepository,

    @inject('PasswordHasher')
    private readonly passwordHasher: IPasswordHasher,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  public override async handle({
    command: { password, username, email },
  }: ICommandContext<AuthCommands, 'CreateUserCommand'>) {
    const passwordHash = await this.passwordHasher.hashPassword(password);

    const role = await this.roleRepo.getRole(USER_ROLE_ID);

    if (!role) {
      throw new AuthError(`User role was not found!`);
    }

    this.grants.requires({
      capability: 'user:create',
    });

    const user = User.create({
      id: username,
      email,
      passwordHash,
      roles: [role.toObject()],
    });

    await this.userRepo.saveUser(user);
  }
}
