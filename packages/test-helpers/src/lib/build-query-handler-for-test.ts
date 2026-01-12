import { buildInstance, getQueryContextBuilder } from '@lib';
import type {
  AbstractQueryHandler,
  IPickQuery,
  IQuery,
} from '@zero/application-core';

type GetQueries<T> = T extends AbstractQueryHandler<infer TCommand, string>
  ? TCommand
  : never;

type GetKey<T> = T extends AbstractQueryHandler<any, infer TKey> ? TKey : never;

export const buildQueryHandler = async <
  TConstructor extends new (...args: any[]) => AbstractQueryHandler<
    IQuery<string>,
    string
  >
>(
  handler: TConstructor,
  key: GetKey<InstanceType<TConstructor>>,
  params: IPickQuery<
    GetQueries<InstanceType<TConstructor>>,
    GetKey<InstanceType<TConstructor>>
  >['params'],
  user?: string
) => {
  const [handlerInstance, ...dependencies] = await buildInstance(handler);

  const getContext =
    getQueryContextBuilder<GetQueries<InstanceType<TConstructor>>>();

  const context = getContext(key, params, user);

  return { handler: handlerInstance, dependencies, context };
};
