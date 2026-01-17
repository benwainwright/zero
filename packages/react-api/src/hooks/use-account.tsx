import { useData } from '@hooks';

export const useAccount = (id?: string) => {
  const {
    data: account,
    isPending,
    update,
    save,
  } = useData(
    {
      query: 'GetAccountQuery',
      updaterKey: 'UpdateAccountCommand',
      mapToLocalData: (account) => ({
        id: account.id,
        name: account.name,
        description: account.description ?? '',
        linkedOpenBankingAccount: account.linkedOpenBankingAccount,
      }),
      refreshOn: ['AccountUpdated', 'AccountLinked', 'AccountLinkRemoved'],
      load: Boolean(id),
    },
    {
      id: id ?? '',
    }
  );

  return {
    isPending,
    account,
    updateUser: update,
    saveUser: save,
  };
};
