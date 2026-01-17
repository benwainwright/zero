import type { IRole } from '@zero/domain';

export type AuthCommands =
  | {
      id: string;
      key: 'CreateRoleCommand';
      params: Omit<IRole, 'id'>;
      response: undefined;
    }
  | {
      id: string;
      key: 'UpdateRoleCommand';
      params: IRole;
      response: undefined;
    }
  | {
      id: string;
      key: 'DeleteRoleCommand';
      params: {
        id: string;
      };
      response: undefined;
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
      response: undefined;
    }
  | {
      id: string;
      key: 'LogoutCommand';
      params: undefined;
      response: undefined;
    }
  | {
      id: string;
      key: 'CreateUserCommand';
      params: {
        email: string;
        password: string;
        username: string;
      };
      response: undefined;
    }
  | {
      id: string;
      key: 'DeleteUserCommand';
      params: {
        username: string;
      };
      response: undefined;
    }
  | {
      id: string;
      key: 'LoginCommand';
      params: {
        username: string;
        password: string;
      };
      response: undefined;
    };
