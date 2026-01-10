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
      command: 'UpdateAccountCommand',
      refreshOn: ['AccountUpdated'],
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
