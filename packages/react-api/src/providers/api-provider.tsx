import type {
  IKnownRequests,
  IKnownEvents,
} from '@zero/websocket-adapter/client';
import { createContext, type ReactNode } from 'react';
import { useApi } from '@hooks';
import type { IEventListener, IServiceClient } from '@zero/application-core';

interface IApi {
  services: IServiceClient<IKnownRequests>;
  eventBus: IEventListener<IKnownEvents>;
}

interface IApiContextType {
  api?: IApi | undefined;
}

export const ApiContext = createContext<IApiContextType>({});

interface IApiProviderProps {
  url: string | undefined;
  children: ReactNode;
}

export const ApiProvider = ({ url, children }: IApiProviderProps) => {
  const api = useApi(url);

  return <ApiContext value={{ api }}>{children}</ApiContext>;
};
