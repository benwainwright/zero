import { buildInstance, getQueryContextBuilder } from '@zero/test-helpers';
import { GetOpenBankingInstitutionListQuery } from './get-open-banking-institution-list-query.ts';
import type { AccountsQueries } from '@services';
import { when } from 'vitest-when';
import { BankConnection } from '@zero/domain';

import { Serialiser } from '@zero/serialiser';
import { mock } from 'vitest-mock-extended';

vi.mock('@zero/serialiser');

afterEach(() => {
  vi.resetAllMocks();
});

const getContext = getQueryContextBuilder<AccountsQueries>();

describe('get open banking institution list query', () => {
  it('gets the list from  object storage and returnts it', async () => {
    const [handler, storage] = await buildInstance(
      GetOpenBankingInstitutionListQuery
    );

    const context = getContext(
      'GetOpenBankingInstitutionList',
      undefined,
      'ben'
    );

    when(storage.get).calledWith('open-banking', 'ben').thenResolve('FOO-BAR');

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
