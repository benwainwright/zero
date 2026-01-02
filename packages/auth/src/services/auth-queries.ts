import type { Role, User } from '@zero/domain';

export type AuthQueries =
  | {
      id: string;
      key: 'GetRole';
      params: { id: string };
      response: Role;
    }
  | {
      id: string;
      key: 'GetRoles';
      params: { limit: number; offset: number };
      response: Role[];
    }
  | {
      id: string;
      key: 'GetUser';
      params: { username: string };
      response: User;
    }
  | {
      id: string;
      key: 'GetCurrentUser';
      params: undefined;
      response: User | undefined;
    }
  | {
      id: string;
      key: 'GetUsers';
      params: { limit: number; offset: number };
      response: User[];
    };
