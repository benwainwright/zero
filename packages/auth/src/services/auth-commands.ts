import type { IRole } from '@zero/domain';

export type AuthCommands =
  | {
      id: string;
      key: 'CreateRoleCommand';
      params: Omit<IRole, 'id'>;
    }
  | {
      id: string;
      key: 'UpdateRoleCommand';
      params: IRole;
    }
  | {
      id: string;
      key: 'DeleteRoleCommand';
      params: {
        id: string;
      };
    }
  | {
      id: string;
      key: 'UpdateUserCommand';
      params: {
        email: string;
        password: string;
        username: string;
        roles: string[];
      };
    }
  | {
      id: string;
      key: 'LogoutCommand';
      params: undefined;
    }
  | {
      id: string;
      key: 'CreateUserCommand';
      params: {
        email: string;
        password: string;
        username: string;
      };
    }
  | {
      id: string;
      key: 'DeleteUserCommand';
      params: {
        username: string;
      };
    }
  | {
      id: string;
      key: 'LoginCommand';
      params: {
        username: string;
        password: string;
      };
    };
