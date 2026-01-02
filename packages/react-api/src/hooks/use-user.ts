import { useEffect, useState } from 'react';
import { useData } from './use-data.ts';
import type { User } from '@zero/domain';

interface ILocalUser {
  email: string;
  password: string;
}

export const useUser = (username: string) => {
  const [localUser, setLocalUser] = useState<ILocalUser | undefined>();
  const {
    data: user,
    isPending,
    update,
  } = useData(
    {
      query: 'GetUser',
      command: 'UpdateUserCommand',
      refreshOn: ['UserUpdated'],
    },
    {
      username,
    }
  );

  const mapUser = (user: User): ILocalUser => ({
    password: '',
    email: user.email,
  });

  useEffect(() => {
    if (user) {
      setLocalUser(mapUser(user));
    }
  }, [username, user]);

  const saveUser = async (user: ILocalUser) => {
    if (localUser) {
      await update({
        username,
        email: user.email,
        password: user.password,
      });
    }
  };

  return { isPending, user: localUser, saveUser };
};
