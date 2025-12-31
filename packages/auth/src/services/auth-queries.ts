import type { User } from '@zero/domain';

export type AuthQueries =
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
