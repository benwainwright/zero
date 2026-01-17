import { buildInstance, getRequestContextBuilder } from '@lib';
import type {
  AbstractRequestHandler,
  IPickRequest,
  IRequest,
} from '@zero/application-core';

type GetRequests<T> = T extends AbstractRequestHandler<infer TCommand, string>
  ? TCommand
  : never;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GetKey<T> = T extends AbstractRequestHandler<any, infer TKey>
  ? TKey
  : never;

export const buildRequestHandler = async <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TConstructor extends new (...args: any[]) => AbstractRequestHandler<
    IRequest<string>,
    string
  >
>(
  handler: TConstructor,
  key: GetKey<InstanceType<TConstructor>>,
  params: IPickRequest<
    GetRequests<InstanceType<TConstructor>>,
    GetKey<InstanceType<TConstructor>>
  >['params'],
  user?: string
) => {
  const [handlerInstance, ...dependencies] = await buildInstance(handler);

  const getContext =
    getRequestContextBuilder<GetRequests<InstanceType<TConstructor>>>();

  const context = getContext(key, params, user);

  return { handler: handlerInstance, dependencies, context };
};
