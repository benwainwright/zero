import { AbstractCommand } from '@zero/application-core';
import type { User } from '@zero/domain';

export class DeleteUserCommand extends AbstractCommand<'delete-user'> {
  public readonly name = 'delete-user';

  public constructor(public readonly user: User) {
    super();
  }
}
