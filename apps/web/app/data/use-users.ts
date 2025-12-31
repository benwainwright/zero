import type { IPickQuery } from '@zero/application-core';
import type { IUser, User } from '@zero/domain';
import type { IKnownQueries } from '@zero/websocket-adapter/client';
import { useContext, useEffect, useState, useTransition } from 'react';
import { ApiContext } from './api-provider.tsx';

export const useUsers = (offset: number, limit: number) => {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<User[]>([]);
  const { api } = useContext(ApiContext);

  const foo = await api?.executeQuery({
    key: 'GetUsers',
    params: { offset, limit },
  });

  useEffect(() => {
    startTransition(async () => {
      setUsers();
    });
  }, []);

  return { isPending, users };
};
