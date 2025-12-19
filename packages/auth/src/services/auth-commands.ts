export type AuthCommands =
  | {
      key: 'UpdateUserCommand';
      params: {
        email: string;
        password: string;
        username: string;
      };
    }
  | {
      key: 'LogoutCommand';
      params: undefined;
    }
  | {
      key: 'CreateUserCommand';
      params: {
        email: string;
        password: string;
        username: string;
      };
    }
  | {
      key: 'DeleteUserCommand';
      params: {
        username: string;
      };
    }
  | {
      key: 'LoginCommand';
      params: {
        username: string;
        password: string;
      };
    };
