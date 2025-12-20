import { ConfigValue, module } from '@zero/bootstrap';
import type { IInternalTypes } from './i-internal-types.ts';

export const testOverridesModule = module<IInternalTypes>(({ load }) => {
  load
    .rebindSync('DatabaseFilename')
    .toConstantValue(new ConfigValue(Promise.resolve(':memory:')));

  load
    .rebindSync('DatabaseTablePrefix')
    .toConstantValue(new ConfigValue(Promise.resolve('zero')));
});
