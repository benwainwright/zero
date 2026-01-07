import { createTests } from '@zero/data-adapters-tests';
import {
  createCallback,
  afterCallback,
  testOverridesModule,
} from '@test-helpers';
import { postgresAdaptersModule } from '@core';

await createTests({
  modules: [postgresAdaptersModule, testOverridesModule],
  createCallback,
  afterCallback,
});
