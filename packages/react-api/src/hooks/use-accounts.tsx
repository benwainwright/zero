import { useData } from '@hooks';

export const useAccounts = (offset: number, limit: number) => {
  const { data: accounts } = useData(
    {
      query: 'ListUserAccountsQuery',
      refreshOn: ['AccountCreated', 'AccountDeleted', 'AccountUpdated'],
    },
    { offset, limit }
  );

  return accounts;
};
