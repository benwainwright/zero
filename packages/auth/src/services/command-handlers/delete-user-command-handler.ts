import {
  AbstractCommandHandler,
  type ICommandContext,
} from '@zero/application-core';
import type { IUserRepository } from '@ports';
import { injectable } from 'inversify';
import { inject } from '@core';
import type { AuthCommands } from '../auth-commands.ts';
import type { ILogger } from '@zero/bootstrap';

@injectable()
export class DeleteUserCommandHandler extends AbstractCommandHandler<
  AuthCommands,
  'DeleteUserCommand'
> {
  public override readonly name = 'DeleteUserCommand';

  public constructor(
    @inject('UserRepository')
    private readonly userRepo: IUserRepository,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    command: { username },
  }: ICommandContext<AuthCommands, 'DeleteUserCommand'>): Promise<void> {
    const user = await this.userRepo.get(username);
    if (user) {
      this.userRepo.delete(user);
    }
  }
}
