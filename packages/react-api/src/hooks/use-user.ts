import { useData } from './use-data.ts';

export const useUser = (username: string) => {
  const {
    data: user,
    isPending,
    update,
    save,
  } = useData(
    {
      query: 'GetUser',
      updaterKey: 'UpdateUserCommand',
      mapToLocalData: (user) => {
        return {
          username: user.id,
          email: user.email,
          roles: user.roles.map((item) => item.id),
          password: '',
        };
      },
      refreshOn: ['UserUpdated'],
    },
    {
      username,
    }
  );

  return {
    isPending,
    user,
    updateUser: update,
    saveUser: save,
  };
};
