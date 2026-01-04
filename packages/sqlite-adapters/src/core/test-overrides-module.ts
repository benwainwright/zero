import { ConfigValue, type IModule } from '@zero/bootstrap';
import type { IInternalTypes } from './i-internal-types.ts';

export const testOverridesModule: IModule<IInternalTypes> = async ({
  rebindSync,
}) => {
  rebindSync('DatabaseFilename').toConstantValue(
    new ConfigValue(Promise.resolve(':memory:'))
  );

  rebindSync('DatabaseTablePrefix').toConstantValue(
    new ConfigValue(Promise.resolve('zero'))
  );
};
