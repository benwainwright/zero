import {
  AbstractCommand,
  AbstractCommandHandler,
  type ICommandContext,
} from '@zero/application-core';
import { DeleteUserCommand } from './delete-user-command.ts';
import type { IUserRepository } from '@ports';
import { injectable } from 'inversify';
import { inject } from '@core';

@injectable()
export class DeleteUserCommandHandler extends AbstractCommandHandler<DeleteUserCommand> {
  public constructor(
    @inject('UserRepository')
    private readonly userRepo: IUserRepository
  ) {
    super();
  }

  public override canHandle(
    thing: AbstractCommand<string>
  ): thing is DeleteUserCommand {
    return thing instanceof DeleteUserCommand;
  }

  protected override async handle(
    _context: ICommandContext<DeleteUserCommand>
  ): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
