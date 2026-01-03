import type { IRole, IUser } from '@zero/domain';

export interface Database {
  users: Omit<IUser, 'roles'>;
  roles: IRole;
  user_roles: {
    userId: string;
    roleId: string;
  };
}
