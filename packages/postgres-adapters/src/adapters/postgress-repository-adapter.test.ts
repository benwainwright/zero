import {
  testUserAndRoleRepository,
  createRepo,
} from '@zero/data-adapters-tests';

import { createCallback, afterCallback } from '@test-helpers';
import { postgresAdaptersModule, testOverridesModule } from '@core';

const creator = await createRepo({
  repoKey: { userRepo: 'UserRepository', roleRepo: 'RoleRepository' },
  modules: [postgresAdaptersModule, testOverridesModule],
  createCallback,
  afterCallback,
});

testUserAndRoleRepository(creator);
