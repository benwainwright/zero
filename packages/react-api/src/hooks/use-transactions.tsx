import { useData } from '@hooks';

export const useTransactions = (
  accountId: string | undefined,
  offset: number,
  limit: number
) => {
  const { data: transactions } = useData(
    {
      query: 'ListTransactionsQuery',
      load: Boolean(accountId),
      refreshOn: [
        'TransactionCreated',
        'TransactionCreated',
        'TransactionDeleted',
      ],
    },
    {
      accountId: accountId ?? '',
      offset,
      limit,
    }
  );

  return transactions;
};
