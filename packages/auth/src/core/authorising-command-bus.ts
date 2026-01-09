import type {
  ICommand,
  ICommandBus,
  ICurrentUserCache,
} from '@zero/application-core';
import { injectable } from 'inversify';
import { inject } from './typed-inject.ts';
import type { IGrantManager } from '@ports';

@injectable()
export class AuthorisingCommandBus implements ICommandBus {
  public constructor(
    @inject('CommandBus')
    private readonly nextBus: ICommandBus,

    @inject('GrantService')
    private readonly grantService: IGrantManager,

    @inject('CurrentUserCache')
    private readonly userStore: ICurrentUserCache
  ) {}

  public async execute(command: ICommand<string>): Promise<void> {
    const user = await this.userStore.get();

    if (user) {
      this.grantService.setActor(user);
    }

    await this.nextBus.execute(command);
    this.grantService.done();
  }
}
