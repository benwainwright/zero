import {
  AbstractCommandHandler,
  type ICommandContext,
  type IPickCommand,
  type IWriteRepository,
} from '@zero/application-core';
import type { IGrantManager, IUserRepository } from '@ports';
import { injectable } from 'inversify';
import { inject } from '@core';
import type { AuthCommands } from '../auth-commands.ts';
import type { ILogger } from '@zero/bootstrap';
import type { User } from '@zero/domain';

@injectable()
export class DeleteUserCommandHandler extends AbstractCommandHandler<
  AuthCommands,
  'DeleteUserCommand'
> {
  public override readonly name = 'DeleteUserCommand';

  public constructor(
    @inject('UserRepository')
    private readonly userRepo: IUserRepository,

    @inject('UserWriter')
    private readonly userWriter: IWriteRepository<User>,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    command: { username },
  }: ICommandContext<
    IPickCommand<AuthCommands, 'DeleteUserCommand'>
  >): Promise<void> {
    const user = await this.userRepo.require(username);

    this.grants.requires({
      capability: 'user:delete',
      for: user,
    });

    this.userWriter.delete(user);
  }
}
