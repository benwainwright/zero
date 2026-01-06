import {
  testUserAndRoleRepository,
  createRepo,
  testAccountsRepo,
  testOauthRepository,
} from '@zero/data-adapters-tests';

import { createCallback, afterCallback } from '@test-helpers';
import { postgresAdaptersModule, testOverridesModule } from '@core';

const userRepoCreator = await createRepo({
  repoKey: { userRepo: 'UserRepository', roleRepo: 'RoleRepository' },
  modules: [postgresAdaptersModule, testOverridesModule],
  createCallback,
  afterCallback,
});

testUserAndRoleRepository(userRepoCreator);

const accountRepoCreator = await createRepo({
  repoKey: { accountsRepo: 'AccountRepository', userRepo: 'UserRepository' },
  modules: [postgresAdaptersModule, testOverridesModule],
  createCallback,
  afterCallback,
});

testAccountsRepo(accountRepoCreator);

const oauthTokenRepoCreator = await createRepo({
  repoKey: { repo: 'OauthTokenRepository', userRepo: 'UserRepository' },
  modules: [postgresAdaptersModule, testOverridesModule],
  createCallback,
  afterCallback,
});

testOauthRepository(oauthTokenRepoCreator);
