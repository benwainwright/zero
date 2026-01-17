import { injectable } from 'inversify';
import { inject, multiInject } from './typed-inject.ts';
import type { AbstractRequestHandler } from './abstract-request-handler.ts';
import type { IRequest } from '@types';
import type { ICurrentUserCache, IEventBus, IServiceBus } from '@ports';
import { AppError } from '@errors';

@injectable()
export class ServiceBus<IRequests extends IRequest<string>>
  implements IServiceBus
{
  public constructor(
    @multiInject('RequestHandler')
    private readonly handlers: AbstractRequestHandler<IRequests, string>[],

    @inject('CurrentUserCache')
    private readonly userStore: ICurrentUserCache,

    @inject('EventBus')
    private readonly events: IEventBus
  ) {}

  public async execute<TQuery extends IRequest<string>>(
    params: Omit<TQuery, 'response'>
  ): Promise<TQuery['response']> {
    const currentUser = await this.userStore.get();
    for (const handler of this.handlers) {
      const result = await handler.tryHandle({
        params,
        authContext: currentUser,
        events: this.events,
      });
      if (result.handled) {
        return result.response;
      }
    }

    throw new AppError(`No handler found for query '${params.key}'`);
  }
}
