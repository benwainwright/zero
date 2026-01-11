import { useCommand, useData, useQuery, useSingleQuery } from '@hooks';
import type { BankConnection } from '@zero/domain';
import { useEffect } from 'react';

interface BankConnectionConnected {
  loaded: true;
  isConnected: true;
  details: {
    logo: string;
    bankName: string;
    connected: Date;
    refreshed: Date | undefined;
    expires: Date;
  };
}

interface BankConnectionNotConnected {
  loaded: true;
  isConnected: false;
  createConnection: (connection: BankConnection) => Promise<void>;
  institutionList: BankConnection[];
}

interface BankConnectionLoading {
  loaded: false;
}

export const useBankConnection = ():
  | BankConnectionLoading
  | BankConnectionConnected
  | BankConnectionNotConnected => {
  const { execute: fetchInstitutions } = useCommand(
    'FetchOpenBankingInstitutionListCommand',
    {
      wait: true,
    }
  );

  const { execute: deleteAuthLink } = useCommand('DeleteAuthLinkCommand');

  const { data: authLink, refresh: refreshAuthLink } = useQuery(
    'GetBankAuthLinkQuery'
  );

  useEffect(() => {
    (async () => {
      console.log(authLink);
      if (authLink?.url) {
        await deleteAuthLink();
        window.location.href = authLink.url;
      }
    })();
  }, [authLink?.url]);

  const { data } = useData({
    query: 'CheckBankConnectionQuery',
    refreshOn: [
      'BankConnectionCreated',
      'BankConnectionDeleted',
      'BankConnectionRefreshed',
      'BankConnectionRequisitionSaved',
      'OauthTokenCreated',
      'OauthTokenDeleted',
      'OauthTokenRefreshed',
      'OauthTokenUsed',
    ],
  });

  const isConnected = data?.status === 'connected';

  const { refresh, data: institutionList } = useQuery(
    'GetOpenBankingInstitutionList',
    !isConnected
  );

  const { execute: createBankConnection } = useCommand(
    'CreateBankConnectionCommand',
    { wait: true }
  );

  useEffect(() => {
    (async () => {
      if (!isConnected && institutionList === undefined) {
        await fetchInstitutions();
        refresh();
      }
    })();
  }, [JSON.stringify(institutionList), isConnected]);

  if (!institutionList || !data) {
    return { loaded: false };
  }

  if (isConnected) {
    return { isConnected, loaded: true, details: data } as const;
  }

  const createConnection = async (institution: BankConnection) => {
    await createBankConnection(institution);
    refreshAuthLink();
  };

  return {
    isConnected,
    institutionList,
    createConnection,
    loaded: true,
  };
};
