import type {
  ICurrentUserCache,
  IQuery,
  IQueryBus,
} from '@zero/application-core';
import { injectable } from 'inversify';
import { inject } from './typed-inject.ts';
import type { IGrantManager } from '@ports';

@injectable()
export class AuthorisingQueryBus implements IQueryBus {
  public constructor(
    @inject('QueryBus')
    private readonly nextBus: IQueryBus,

    @inject('GrantService')
    private readonly grantService: IGrantManager,

    @inject('CurrentUserCache')
    private readonly userStore: ICurrentUserCache
  ) {}

  public async execute<TQuery extends IQuery<string>>(
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
