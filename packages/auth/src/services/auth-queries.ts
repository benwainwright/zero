import type { User } from '@zero/domain';

export type AuthQueries = {
  query: {
    key: 'GetCurrentUser';
    params: undefined;
  };
  response: User | undefined;
};
