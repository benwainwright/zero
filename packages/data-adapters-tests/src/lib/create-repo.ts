import {
  TypedContainer,
  type TypedContainerModule,
} from '@inversifyjs/strongly-typed';
import { mock } from 'vitest-mock-extended';

import type {
  IApplicationTypes,
  IDomainEventBuffer,
  IUnitOfWork,
} from '@zero/application-core';

import type { Mocked } from 'vitest';
import {
  type ILogger,
  type IBootstrapTypes,
  type IBootstrapper,
  type IDecoratorManager,
} from '@zero/bootstrap';
import type { IAuthTypes } from '@zero/auth';

type DataPortsWithMock = IBootstrapTypes & IAuthTypes & IApplicationTypes;

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type WithOutputs<TKey extends Record<string, keyof DataPortsWithMock>> =
  Expand<{
    [K in keyof TKey]: DataPortsWithMock[TKey[K]];
  }>;

export const createRepo = async <
  TKey extends Record<string, keyof DataPortsWithMock>
>(
  repoKey: TKey,
  ...modules: TypedContainerModule<DataPortsWithMock>[]
): Promise<
  {
    unitOfWork: IUnitOfWork;
    eventBuffer: Mocked<IDomainEventBuffer>;
  } & WithOutputs<TKey>
> => {
  const container = new TypedContainer<DataPortsWithMock & IBootstrapTypes>();
  const bootstrapper = mock<IBootstrapper>();
  const logger = mock<ILogger>();
  const decoratorManager = mock<IDecoratorManager>();
  container.bind('DecoratorManager').toConstantValue(decoratorManager);
  container.bind('Bootstrapper').toConstantValue(bootstrapper);
  container.bind('Logger').toConstantValue(logger);
  container.bind('Container').toConstantValue(container);
  const mockEventBuffer = mock<IDomainEventBuffer>();
  container.bind('DomainEventBuffer').toConstantValue(mockEventBuffer);

  for (const module of modules) {
    await container.load(module);
  }

  container.get('Bootstrapper');

  const thing = Object.fromEntries(
    await Promise.all(
      Object.entries(repoKey).map(async ([key, item]) => [
        key,
        await container.getAsync(item),
      ])
    )
  ) as WithOutputs<TKey>;

  return {
    ...thing,
    unitOfWork: await container.getAsync('UnitOfWork'),
    eventBuffer: mockEventBuffer,
  };
};
