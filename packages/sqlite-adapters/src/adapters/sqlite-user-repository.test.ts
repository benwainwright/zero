import {
  createRepo,
  testUserAndRoleRepository,
} from '@zero/data-adapters-tests';
import { sqliteAdaptersModule, testOverridesModule } from '@core';

testUserAndRoleRepository(() =>
  createRepo(
    { userRepo: 'UserRepository', roleRepo: 'RoleRepository' },
    sqliteAdaptersModule,
    testOverridesModule
  )
);
