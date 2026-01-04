import { TypedContainer } from '@inversifyjs/strongly-typed';
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
  type IDecoratorManager,
  type BindingMap,
  type IModule,
  testModule,
} from '@zero/bootstrap';
import type { IAuthTypes } from '@zero/auth';
import { inject, injectable } from 'inversify';

type DataPortsWithMock = IBootstrapTypes & IAuthTypes & IApplicationTypes;

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

type WithOutputs<TKey extends Record<string, keyof DataPortsWithMock>> =
  Expand<{
    [K in keyof TKey]: DataPortsWithMock[TKey[K]];
  }>;

type CreateFunction<TKey extends Record<string, keyof DataPortsWithMock>> =
  () => Promise<
    {
      unitOfWork: IUnitOfWork;
      eventBuffer: Mocked<IDomainEventBuffer>;
    } & WithOutputs<TKey>
  >;

export const createRepo = async <
  TKey extends Record<string, keyof DataPortsWithMock>
>({
  repoKey,
  modules,
  createCallback,
  afterCallback,
}: {
  repoKey: TKey;
  modules: IModule<DataPortsWithMock>[];
  afterCallback?: <TMap extends BindingMap>(
    container: TypedContainer<DataPortsWithMock & TMap>
  ) => Promise<void>;
  createCallback?: <TMap extends BindingMap>(
    container: TypedContainer<DataPortsWithMock & TMap>
  ) => Promise<void>;
}): Promise<CreateFunction<TKey>> => {
  const container = new TypedContainer<DataPortsWithMock & IBootstrapTypes>();

  const logger = mock<ILogger>();

  const decoratorManager = mock<IDecoratorManager>();
  container.bind('DecoratorManager').toConstantValue(decoratorManager);
  container.bind('Logger').toConstantValue(logger);
  container.bind('Container').toConstantValue(container);
  const mockEventBuffer = mock<IDomainEventBuffer>();
  container.bind('DomainEventBuffer').toConstantValue(mockEventBuffer);

  for (const module of modules) {
    await container.load(testModule(module));
  }

  afterEach(async () => {
    await afterCallback?.(container);
  });

  return async () => {
    await createCallback?.(container);
    const unit = await container.getAsync('UnitOfWork');

    const thing = Object.fromEntries(
      await Promise.all(
        Object.entries(repoKey).map(async ([key, _item], index) => {
          @injectable()
          class RepoContainer {
            public constructor(
              @inject('UnitOfWork')
              public readonly unitOfWork: IUnitOfWork,

              @inject(_item)
              public readonly item: unknown
            ) {}
          }
          const child = new TypedContainer({ parent: container });
          child.bind('UnitOfWork').toConstantValue(unit);
          child.bind(`repo-container-${index}`).to(RepoContainer);

          return [key, (await child.getAsync(`repo-container-${index}`)).item];
        })
      )
    ) as WithOutputs<TKey>;
    return {
      ...thing,
      unitOfWork: unit,
      eventBuffer: mockEventBuffer,
    };
  };
};
