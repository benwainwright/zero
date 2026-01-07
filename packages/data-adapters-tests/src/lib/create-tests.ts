import {
  testUserAndRoleRepository,
  testAccountsRepo,
  testOauthRepository,
  testBankConnectionRepository,
  testSyncDetailsRepository,
  testTransactionRepository,
} from '@tests';

import { createRepo } from './create-repo.ts';
import type { BindingMap, IBootstrapTypes, IModule } from '@zero/bootstrap';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { IAuthTypes } from '@zero/auth';
import type { IApplicationTypes } from '@zero/application-core';
import type { IAccountsTypes } from '@zero/accounts';

type DataPortsWithMock = IBootstrapTypes &
  IAuthTypes &
  IApplicationTypes &
  IAccountsTypes;

interface CreateTestsConfig {
  modules: IModule<DataPortsWithMock>[];
  afterCallback?: <TMap extends BindingMap>(
    container: TypedContainer<DataPortsWithMock & TMap>
  ) => Promise<void>;
  createCallback?: <TMap extends BindingMap>(
    container: TypedContainer<DataPortsWithMock & TMap>
  ) => Promise<void>;
}

export const createTests = async ({
  modules,
  afterCallback,
  createCallback,
}: CreateTestsConfig) => {
  const userRepoCreator = await createRepo({
    repoKey: { userRepo: 'UserRepository', roleRepo: 'RoleRepository' },
    modules,
    createCallback,
    afterCallback,
  });

  testUserAndRoleRepository(userRepoCreator);

  const accountRepoCreator = await createRepo({
    repoKey: { accountsRepo: 'AccountRepository', userRepo: 'UserRepository' },
    modules,
    createCallback,
    afterCallback,
  });

  testAccountsRepo(accountRepoCreator);

  const oauthTokenRepoCreator = await createRepo({
    repoKey: { repo: 'OauthTokenRepository', userRepo: 'UserRepository' },
    modules,
    createCallback,
    afterCallback,
  });

  testOauthRepository(oauthTokenRepoCreator);

  const bankConnectionRepoCreator = await createRepo({
    repoKey: { repo: 'BankConnectionRepository', userRepo: 'UserRepository' },
    modules,
    createCallback,
    afterCallback,
  });

  testBankConnectionRepository(bankConnectionRepoCreator);

  const syncDetailsRepository = await createRepo({
    repoKey: { repo: 'SyncDetailsRepository', userRepo: 'UserRepository' },
    modules,
    createCallback,
    afterCallback,
  });

  testSyncDetailsRepository(syncDetailsRepository);

  const transactionRepoCreator = await createRepo({
    repoKey: {
      repo: 'TransactionRepository',
      userRepo: 'UserRepository',
      accountRepo: 'AccountRepository',
    },
    modules,
    createCallback,
    afterCallback,
  });

  testTransactionRepository(transactionRepoCreator);
};
