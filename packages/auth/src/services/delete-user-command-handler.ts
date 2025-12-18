import {
  AbstractCommandHandler,
  type ICommandContext,
} from '@zero/application-core';
import type { IUserRepository } from '@ports';
import { injectable } from 'inversify';
import { inject } from '@core';
import type { AuthCommands } from './auth-commands.ts';

@injectable()
export class DeleteUserCommandHandler extends AbstractCommandHandler<
  AuthCommands,
  'CreateUserCommand'
> {
  public override readonly name = 'CreateUserCommand';

  public constructor(
    @inject('UserRepository')
    private readonly userRepo: IUserRepository
  ) {
    super();
  }

  protected override async handle(
    _context: ICommandContext<AuthCommands, 'DeleteUserCommand'>
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
