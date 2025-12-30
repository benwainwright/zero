import type { User } from '@zero/domain';

export type AuthQueries =
  | {
      query: {
        id: string;
        key: 'GetCurrentUser';
        params: undefined;
      };
      response: User | undefined;
    }
  | {
      query: {
        id: string;
        key: 'GetUsers';
        params: { limit: number; offset: number };
      };
      response: User[];
    };
