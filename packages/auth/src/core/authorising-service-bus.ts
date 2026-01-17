import type {
  ICurrentUserCache,
  IRequest,
  IServiceBus,
} from '@zero/application-core';
import { injectable } from 'inversify';
import { inject } from './typed-inject.ts';
import type { IGrantManager } from '@ports';

@injectable()
export class AuthorisingServiceBus implements IServiceBus {
  public constructor(
    @inject('ServiceBus')
    private readonly nextBus: IServiceBus,

    @inject('GrantService')
    private readonly grantService: IGrantManager,

    @inject('CurrentUserCache')
    private readonly userStore: ICurrentUserCache
  ) {}

  public async execute<TQuery extends IRequest<string>>(
    command: Omit<TQuery, 'response'>
  ): Promise<TQuery['response']> {
    const user = await this.userStore.get();
    if (user) {
      this.grantService.setActor(user);
    }
    const result = await this.nextBus.execute<TQuery>(command);
    this.grantService.done();
    return result;
  }
}
