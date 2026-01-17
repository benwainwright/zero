import type {
  IPickRequest,
  IRequest,
  IRequestContext,
  ITryHandleRequestResponse,
} from '@types';
import { BaseHandler } from './base-handler.ts';
import type { User } from '@zero/domain';
import type { IEventBus } from '@ports';

export abstract class AbstractRequestHandler<
  TRequests extends IRequest<string>,
  TKey extends TRequests['key']
> extends BaseHandler<TKey> {
  protected canHandle(
    thing: Omit<IRequest<string>, 'response'>
  ): thing is IPickRequest<TRequests, TKey> {
    return thing.key === this.name;
  }

  protected abstract handle(
    context: IRequestContext<IPickRequest<TRequests, TKey>>
  ): Promise<IPickRequest<TRequests, TKey>['response']>;

  public async tryHandle({
    params,
    authContext,
    events,
  }: {
    params: Omit<IRequest<string>, 'response'>;
    events: IEventBus;
    authContext: User | undefined;
  }): Promise<
    ITryHandleRequestResponse<IPickRequest<TRequests, TKey>['response']>
  > {
    if (this.canHandle(params)) {
      try {
        events.emit('RequestHandleStartEvent', {
          key: this.name,
          id: params.id,
        });
        return {
          response: await this.handle({
            params: params.params,
            authContext,
            id: params.id,
          }),
          handled: true,
        };
      } finally {
        events.emit('RequestHandleCompleteEvent', {
          key: this.name,
          id: params.id,
        });
      }
    }

    return {
      handled: false,
    };
  }
}
