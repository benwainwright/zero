import type { User } from '@zero/domain';

export type AuthQueries = {
  query: {
    id: string;
    key: 'GetCurrentUser';
    params: undefined;
  };
  response: User | undefined;
};
