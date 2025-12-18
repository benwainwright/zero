import {
  AbstractCommandHandler,
  type ICommandContext,
} from '@zero/application-core';
import { CreateUserCommand } from './create-user-command.ts';
import type { IUserRepository } from '@ports';
import { injectable } from 'inversify';
import { inject } from '@core';

@injectable()
export class CreateUserCommandHandler extends AbstractCommandHandler<CreateUserCommand> {
  public constructor(
    @inject('UserRepository')
    private readonly userRepo: IUserRepository
  ) {
    super();
  }

  public override canHandle(thing: unknown): thing is CreateUserCommand {
    return thing instanceof CreateUserCommand;
  }

  public override async handle(_context: ICommandContext<CreateUserCommand>) {}
}
