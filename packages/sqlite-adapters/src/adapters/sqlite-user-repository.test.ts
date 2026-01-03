import {
  createRepo,
  testUserAndRoleRepository,
} from '@zero/data-adapters-tests';
import { sqliteAdaptersModule, testOverridesModule } from '@core';

const creator = await createRepo({
  repoKey: { userRepo: 'UserRepository', roleRepo: 'RoleRepository' },
  modules: [sqliteAdaptersModule, testOverridesModule],
});

testUserAndRoleRepository(creator);
