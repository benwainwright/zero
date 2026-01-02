import { useData } from './use-data.ts';

export const useUsers = (offset: number, limit: number) => {
  const { data: users } = useData(
    {
      query: 'GetUsers',
      refreshOn: ['UserCreated', 'UserUpdated', 'UserDeleted'],
    },
    {
      offset,
      limit,
    }
  );

  return users;
};
