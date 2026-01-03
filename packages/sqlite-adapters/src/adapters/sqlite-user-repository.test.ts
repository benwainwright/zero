import {
  createRepo,
  testUserAndRoleRepository,
} from '@zero/data-adapters-tests';
import { sqliteAdaptersModule, testOverridesModule } from '@core';

const creator = await createRepo(
  { userRepo: 'UserRepository', roleRepo: 'RoleRepository' },
  sqliteAdaptersModule,
  testOverridesModule
);

testUserAndRoleRepository(creator);
