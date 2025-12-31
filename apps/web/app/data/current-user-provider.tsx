import type { User } from '@zero/domain';
import { useContext, useEffect, useState, type ReactNode } from 'react';
import { createContext } from 'react';
import { ApiContext } from './api-provider.tsx';

export interface ICurrentUserProviderContextState {
  user?: User | undefined;
  reload?: () => void | undefined;
  initialLoadComplete: boolean;
}

export const CurrentUserContext =
  createContext<ICurrentUserProviderContextState>({
    initialLoadComplete: false,
  });

interface CurrentUserProviderProps {
  children: ReactNode;
}

export const CurrentUserProvider = ({ children }: CurrentUserProviderProps) => {
  const { api } = useContext(ApiContext);
  const [currentUser, setCurrentUser] = useState<User>();
  const [dirty, setDirty] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    void (async () => {
      if (dirty && api) {
        const user = await api.executeQuery('GetCurrentUser');

        setCurrentUser(user);
        setDirty(false);
        setInitialLoadComplete(true);
      }
    })();
  }, [dirty, api]);
  return (
    <CurrentUserContext
      value={{
        user: currentUser,
        reload: () => setDirty(true),
        initialLoadComplete,
      }}
    >
      {children}
    </CurrentUserContext>
  );
};
