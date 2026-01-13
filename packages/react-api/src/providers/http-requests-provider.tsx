import { useHttpRequests, type RequestRecord } from '@hooks';
import { createContext, type ReactNode } from 'react';

interface HttpRequestsContextType {
  records: RequestRecord[];
}

export const HttpRequestsContext = createContext<HttpRequestsContextType>({
  records: [],
});

const notProd = process.env['NODE_ENV'] !== 'production';

interface HttpRequestsProviderProps {
  children: ReactNode;
}

export const HttpRequestsProvider = ({
  children,
}: HttpRequestsProviderProps) => {
  const requests = notProd ? useHttpRequests() : [];

  return (
    <HttpRequestsContext value={{ records: requests }}>
      {children}
    </HttpRequestsContext>
  );
};
