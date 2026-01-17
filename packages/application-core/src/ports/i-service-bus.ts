import type { IRequest } from '@types';

export interface IServiceBus {
  execute<TRequest extends IRequest<string>>(
    query: Omit<TRequest, 'response'>
  ): Promise<TRequest['response']>;
}
