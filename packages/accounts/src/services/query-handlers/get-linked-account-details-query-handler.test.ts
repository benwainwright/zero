import { buildQueryHandler } from '@zero/test-helpers';
import { GetLinkedAccountsDetailsQuery } from './get-linked-account-details-query.ts';
import { when } from 'vitest-when';
import { ACCOUNT_DETAILS_KEY } from '@constants';

describe('get linked accounts details query', () => {
  it('gets the linked accounts list from object storage and returns it', async () => {
    const {
      handler,
      context,
      dependencies: [storage],
    } = await buildQueryHandler(
      GetLinkedAccountsDetailsQuery,
      'GetLinkedAccountsDetailsQuery',
      undefined,
      'ben'
    );

    const details = [
      { id: 'foo', name: 'bar', details: 'baz' },
      { id: 'baz', name: 'bip', details: 'bong' },
    ];

    when(storage.get)
      .calledWith(ACCOUNT_DETAILS_KEY, 'ben')
      .thenResolve(JSON.stringify(details));

    const result = await handler.tryHandle(context);

    expect(result.handled).toEqual(true);
    if (result.handled) {
      expect(result.response).toEqual(details);
    }
  });
});
