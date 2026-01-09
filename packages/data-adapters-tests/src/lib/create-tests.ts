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
  const { creator: userRepoCreator, after: afterUserRepoTests } =
    await createRepo({
      repoKey: { userRepo: 'UserRepository', roleRepo: 'RoleRepository' },
      modules,
      createCallback,
      afterCallback,
    });

  describe('the user repository', () => {
    afterEach(async () => {
      await afterUserRepoTests();
    });
    testUserAndRoleRepository(userRepoCreator);
  });

  const { creator: accountRepoCreator, after: afterCreateRepoTests } =
    await createRepo({
      repoKey: {
        accountsRepo: 'AccountRepository',
        userRepo: 'UserRepository',
      },
      modules,
      createCallback,
      afterCallback,
    });

  describe('the accounst repo', () => {
    afterEach(async () => {
      await afterCreateRepoTests();
    });
    testAccountsRepo(accountRepoCreator);
  });

  const { creator: oauthTokenRepoCreator, after: afterTokenRepoTests } =
    await createRepo({
      repoKey: { repo: 'OauthTokenRepository', userRepo: 'UserRepository' },
      modules,
      createCallback,
      afterCallback,
    });

  describe('the tokens repo', () => {
    afterEach(async () => {
      await afterTokenRepoTests();
    });
    testOauthRepository(oauthTokenRepoCreator);
  });

  const {
    creator: bankConnectionRepoCreator,
    after: afterConnectionRepoTests,
  } = await createRepo({
    repoKey: { repo: 'BankConnectionRepository', userRepo: 'UserRepository' },
    modules,
    createCallback,
    afterCallback,
  });

  describe('the connectionn repo', () => {
    afterEach(async () => {
      await afterConnectionRepoTests();
    });
    testBankConnectionRepository(bankConnectionRepoCreator);
  });

  const { creator: syncDetailsRepository, after: afterSyncDetailsRepoTests } =
    await createRepo({
      repoKey: { repo: 'SyncDetailsRepository', userRepo: 'UserRepository' },
      modules,
      createCallback,
      afterCallback,
    });

  describe('the sync details repo', () => {
    afterEach(async () => {
      await afterSyncDetailsRepoTests();
    });
    testSyncDetailsRepository(syncDetailsRepository);
  });

  const { creator: transactionRepoCreator, after: afterTxRepoTests } =
    await createRepo({
      repoKey: {
        repo: 'TransactionRepository',
        userRepo: 'UserRepository',
        accountRepo: 'AccountRepository',
      },
      modules,
      createCallback,
      afterCallback,
    });

  describe('the tx repo', () => {
    afterEach(async () => {
      await afterTxRepoTests();
    });
    testTransactionRepository(transactionRepoCreator);
  });
};
