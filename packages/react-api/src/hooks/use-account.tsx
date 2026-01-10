import { useData } from '@hooks';

export const useAccount = (id: string) => {
  const {
    data: account,
    isPending,
    update,
    save,
  } = useData(
    {
      query: 'GetAccountQuery',
      command: 'UpdateAccountCommand',
      refreshOn: ['AccountUpdated'],
    },
    {
      id,
    }
  );

  return {
    isPending,
    account,
    updateUser: update,
    saveUser: save,
  };
};
