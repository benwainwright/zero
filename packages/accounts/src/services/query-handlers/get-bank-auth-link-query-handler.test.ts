import type { AccountsQueries } from '@services';
import { GetBankAuthLinkQueryHandler } from './get-bank-auth-link-query-handler.ts';
import { buildInstance, getQueryContextBuilder } from '@zero/test-helpers';
import { when } from 'vitest-when';

const getContext = getQueryContextBuilder<AccountsQueries>();

describe('get bank auth link query handler', () => {
  it('fetchers the link from storage and returns it', async () => {
    const [handler, storage] = await buildInstance(GetBankAuthLinkQueryHandler);

    const context = getContext('GetBankAuthLinkQuery', undefined, 'ben');

    when(storage.get)
      .calledWith('bank-auth-link', 'ben')
      .thenResolve('the-url');

    const result = await handler.tryHandle(context);

    expect(result.handled).toEqual(true);
    if (result.handled) {
      expect(result.response.url).toEqual('the-url');
    }
  });
});
