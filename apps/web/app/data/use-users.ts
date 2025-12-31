import type { User } from '@zero/domain';
import { useContext, useEffect, useState, useTransition } from 'react';
import { ApiContext } from './api-provider.tsx';

export const useUsers = (offset: number, limit: number) => {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<User[]>([]);
  const { api } = useContext(ApiContext);

  useEffect(() => {
    startTransition(async () => {
      (async () => {
        if (api) {
          setUsers(await api.executeQuery('GetUsers', { offset, limit }));
        }
      })();
    });
  }, [api]);

  return { isPending, users };
};
