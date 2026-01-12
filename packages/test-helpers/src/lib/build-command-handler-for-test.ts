import { buildInstance, getCommandContextBuilder } from '@lib';
import type {
  AbstractCommandHandler,
  ICommand,
  IPickCommand,
} from '@zero/application-core';

type GetCommands<T> = T extends AbstractCommandHandler<infer TCommand, string>
  ? TCommand
  : never;

type GetKey<T> = T extends AbstractCommandHandler<any, infer TKey>
  ? TKey
  : never;

export const buildCommandHandler = async <
  TConstructor extends new (...args: any[]) => AbstractCommandHandler<
    ICommand<string>,
    string
  >
>(
  handler: TConstructor,
  key: GetKey<InstanceType<TConstructor>>,
  params: IPickCommand<
    GetCommands<InstanceType<TConstructor>>,
    GetKey<InstanceType<TConstructor>>
  >['params'],
  user?: string
) => {
  const [handlerInstance, ...dependencies] = await buildInstance(handler);

  const getContext =
    getCommandContextBuilder<GetCommands<InstanceType<TConstructor>>>();

  const context = getContext(key, params, user);

  return { handler: handlerInstance, dependencies, context };
};
