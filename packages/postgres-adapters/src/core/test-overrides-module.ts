import { ConfigValue, module } from '@zero/bootstrap';
import type { IInternalTypes } from '../types/i-internal-types.ts';

export const testOverridesModule = module<IInternalTypes>(({ load }) => {
  load
    .rebindSync('PostgresDatabaseHost')
    .toConstantValue(new ConfigValue(Promise.resolve('localhost')));

  load
    .rebindSync('PostgresDatabaseName')
    .toConstantValue(new ConfigValue(Promise.resolve('zero')));

  load
    .rebindSync('PostgresDatabasePassword')
    .toConstantValue(new ConfigValue(Promise.resolve('password')));

  load
    .rebindSync('PostgressUsername')
    .toConstantValue(new ConfigValue(Promise.resolve('postgres')));
});
