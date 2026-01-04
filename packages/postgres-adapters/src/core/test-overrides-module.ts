import { ConfigValue, type IModule } from '@zero/bootstrap';
import type { IInternalTypes } from '../types/i-internal-types.ts';

export const testOverridesModule: IModule<IInternalTypes> = async ({
  rebindSync,
}) => {
  rebindSync('PostgresDatabaseHost').toConstantValue(
    new ConfigValue(Promise.resolve('localhost'))
  );

  rebindSync('PostgresDatabaseName').toConstantValue(
    new ConfigValue(Promise.resolve('zero'))
  );

  rebindSync('PostgresDatabasePassword').toConstantValue(
    new ConfigValue(Promise.resolve('password'))
  );

  rebindSync('PostgressUsername').toConstantValue(
    new ConfigValue(Promise.resolve('postgres'))
  );
};
