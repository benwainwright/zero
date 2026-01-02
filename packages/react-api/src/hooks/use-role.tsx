import { useData } from './use-data.ts';

export const useRole = (id: string) => {
  const {
    data: role,
    isPending,
    update,
    save,
  } = useData(
    {
      query: 'GetRole',
      command: 'UpdateRoleCommand',
      mapToLocalData: (role) => role?.toObject(),
      refreshOn: ['RoleUpdated'],
    },
    {
      id,
    }
  );

  return { role, isPending, updateRole: update, saveRole: save };
};
