import { AbstractCommand } from '@zero/application-core';

export class CreateUserCommand extends AbstractCommand<'create-user'> {
  public readonly name = 'create-user';

  public constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly password: string
  ) {
    super();
  }
}
