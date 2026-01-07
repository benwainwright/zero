import { createTests } from '@zero/data-adapters-tests';

import { afterCallback, createCallback } from '@test-helpers';

import { sqliteAdaptersModule, testOverridesModule } from '@core';

await createTests({
  modules: [sqliteAdaptersModule, testOverridesModule],
  createCallback,
  afterCallback,
});
