import {
  testUserAndRoleRepository,
  createRepo,
} from '@zero/data-adapters-tests';

testUserAndRoleRepository(() =>
  createRepo({ userRepo: 'UserRepository', roleRepo: 'RoleRepository' })
);
