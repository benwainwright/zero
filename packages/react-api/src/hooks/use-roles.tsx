import { useData } from './use-data.ts';

export const useRoles = (offset: number, limit: number) => {
  const { data: roles } = useData(
    {
      query: 'GetRoles',
      refreshOn: ['RoleCreated', 'RoleDeleted', 'RoleUpdated'],
    },
    {
      offset,
      limit,
    }
  );

  return roles;
};
