import { createTests } from '@zero/data-adapters-tests';
import { createCallback, afterCallback } from '@test-helpers';
import { postgresAdaptersModule, testOverridesModule } from '@core';

await createTests({
  modules: [postgresAdaptersModule, testOverridesModule],
  createCallback,
  afterCallback,
});
