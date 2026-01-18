import { useData, useRequest } from '@hooks';
import { useCallback } from 'react';

export const useTransactions = (
  accountId: string | undefined,
  offset: number,
  limit: number
) => {
  const { execute: startAccountSync } = useRequest(
    'SyncTransactionsCommandHandler'
  );

  const syncAccount = useCallback(async () => {
    if (accountId) {
      await startAccountSync({ accountId });
    }
  }, [accountId]);

  const { data: transactions } = useData(
    {
      query: 'ListTransactionsQuery',
      load: Boolean(accountId),
      refreshOn: [
        'TransactionCreated',
        'TransactionUpdated',
        'TransactionDeleted',
      ],
    },
    {
      accountId: accountId ?? '',
      offset,
      limit,
    }
  );

  return { transactions, syncAccount };
};
