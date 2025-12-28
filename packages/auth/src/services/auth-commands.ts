export type AuthCommands =
  | {
      id: string;
      key: 'UpdateUserCommand';
      params: {
        email: string;
        password: string;
        username: string;
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
