import { useData, useRequest } from '@hooks';
import { useCallback, useState } from 'react';

const PER_PAGE = 20;

export const useTransactions = (
  accountId: string | undefined,
  currentPage: number
) => {
  const { execute: startAccountSync } = useRequest(
    'SyncTransactionsCommandHandler'
  );

  const [page, setPage] = useState<number>(currentPage);

  const syncAccount = useCallback(async () => {
    if (accountId) {
      await startAccountSync({ accountId });
    }
  }, [accountId]);

  const { data: transactions, refresh } = useData(
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
      offset: (page - 1) * PER_PAGE,
      limit: PER_PAGE,
    }
  );

  const setPageCallback = useCallback(
    (page: number) => {
      setPage(page);
      refresh();
    },
    [refresh]
  );

  return {
    transactions,
    syncAccount,
    page,
    setPage: setPageCallback,
    totalPages: (transactions?.total ?? 0) / PER_PAGE,
  };
};
