import { createTests } from '@zero/data-adapters-tests';

import {
  afterCallback,
  createCallback,
  testOverridesModule,
} from '@test-helpers';

import { sqliteAdaptersModule } from '../core/sqlite-adapters-module.ts';

await createTests({
  modules: [sqliteAdaptersModule, testOverridesModule],
  createCallback,
  afterCallback,
});
