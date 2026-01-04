import type { BindingMap } from '@decorator-manager';
import { TypedContainerModule } from '@inversifyjs/strongly-typed';
import { type IModule } from '@types';
import { mock } from 'vitest-mock-extended';
import type { IModuleContext } from '../types/i-module.ts';

export const testModule = <TTypeMap extends BindingMap>(
  module: IModule<TTypeMap>
) => {
  return new TypedContainerModule<TTypeMap>((load) => {
    const mockContext = mock<IModuleContext<TTypeMap>>({
      logger: mock(),
      bind: load.bind,
      rebindSync: load.rebindSync,
    });
    module(mockContext);
  });
};
