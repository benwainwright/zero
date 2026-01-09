import { ConfigValue, type IModule } from '@zero/bootstrap';
import type { IInternalTypes } from '@core';

export const testOverridesModule: IModule<IInternalTypes> = async ({
  rebindSync,
}) => {
  rebindSync('DatabaseFilename').toConstantValue(
    new ConfigValue(Promise.resolve(':memory:'))
  );
};
