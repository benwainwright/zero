import { buildInstance, getQueryContextBuilder } from '@zero/test-helpers';
import { GetOpenBankingInstitutionListQueryHandler } from './get-open-banking-institution-list-query-handler.ts';
import type { AccountsQueries } from '@services';
import { when } from 'vitest-when';
import { BankConnection } from '@zero/domain';

import { Serialiser } from '@zero/serialiser';
import { mock } from 'vitest-mock-extended';
import { INSTITUTION_LIST_STORAGE_KEY } from '../../constants.ts';

vi.mock('@zero/serialiser');

afterEach(() => {
  vi.resetAllMocks();
});

const getContext = getQueryContextBuilder<AccountsQueries>();

describe('get open banking institution list query', () => {
  it('gets the list from  object storage and returnts it', async () => {
    const [handler, storage] = await buildInstance(
      GetOpenBankingInstitutionListQueryHandler
    );

    const context = getContext(
      'GetOpenBankingInstitutionList',
      undefined,
      'ben'
    );

    when(storage.get)
      .calledWith(INSTITUTION_LIST_STORAGE_KEY, 'ben')
      .thenResolve('FOO-BAR');

    const mockSerialiser = mock<Serialiser>();

    when(Serialiser).calledWith().thenReturn(mockSerialiser);

    const mocks = [mock<BankConnection>, mock<BankConnection>];

    when(mockSerialiser.deserialise).calledWith('FOO-BAR').thenReturn(mocks);

    const response = await handler.tryHandle(context);

    expect(response.handled).toEqual(true);
    if (response.handled) {
      expect(response.response).toEqual(mocks);
    }
  });
});
