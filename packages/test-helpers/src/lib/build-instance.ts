import { Container } from 'inversify';
import { StubPlugin } from './stub-plugin.ts';
import { getConstructorArguments } from './get-constructor-arguments.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildInstance = async <
  TConstructor extends new (...args: any[]) => unknown
>(
  thing: TConstructor,
  inputContainer?: Container
): Promise<
  [InstanceType<TConstructor>, ...ConstructorParameters<TConstructor>]
> => {
  const container = inputContainer ?? new Container();
  container.register(StubPlugin);
  container.bind('instance').to(thing);
  const alive = await container.getAsync<InstanceType<TConstructor>>(
    'instance'
  );
  const args = getConstructorArguments(thing);
  const resolvedArgs = (await Promise.all(
    args.map(async (item) => await container.getAsync(item.value))
  )) as ConstructorParameters<TConstructor>;
  return [alive, ...resolvedArgs];
};
