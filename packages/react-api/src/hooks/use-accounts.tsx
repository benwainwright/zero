import { useData } from '@hooks';

export const useAccounts = () => {
  const { data: accounts } = useData({
    query: 'ListUserAccountsQuery',
    refreshOn: ['AccountCreated', 'AccountDeleted', 'AccountUpdated'],
  });

  return accounts;
};
