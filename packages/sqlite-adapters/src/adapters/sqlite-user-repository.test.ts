import {
  createRepo,
  testUserAndRoleRepository,
} from '@zero/data-adapters-tests';

import { afterCallback, createCallback } from '@test-helpers';

import { sqliteAdaptersModule, testOverridesModule } from '@core';

const creator = await createRepo({
  repoKey: { userRepo: 'UserRepository', roleRepo: 'RoleRepository' },
  modules: [sqliteAdaptersModule, testOverridesModule],
  afterCallback,
  createCallback,
});

testUserAndRoleRepository(creator);
