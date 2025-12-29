import type { IAllEvents, IApiSurface } from '@zero/application-core';
import type { AuthEvents } from '@zero/auth';
import type {
  IKnownCommands,
  IKnownQueries,
} from '@zero/websocket-adapter/client';
import { createContext, type ReactNode } from 'react';
import { useApi } from './use-api.ts';

interface IApiContextType {
  api?:
    | IApiSurface<IKnownCommands, IKnownQueries, IAllEvents & AuthEvents>
    | undefined;
}

export const ApiContext = createContext<IApiContextType>({});

interface IApiProviderProps {
  url: string;
  children: ReactNode;
}

export const ApiProvider = ({ url, children }: IApiProviderProps) => {
  const api = useApi(url);

  return <ApiContext value={{ api }}>{children}</ApiContext>;
};
