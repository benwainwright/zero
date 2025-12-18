import type { User } from '@zero/domain';

export type AuthCommands =
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
        user: User;
      };
    }
  | {
      key: 'LoginCommand';
      params: {
        username: string;
        password: string;
      };
    };
