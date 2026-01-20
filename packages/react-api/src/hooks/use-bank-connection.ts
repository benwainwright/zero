import { useData, useRequest } from '@hooks';
import type { IPossbileInstitution, AccountsCommands } from '@zero/accounts';
import type { IPickRequest } from '@zero/application-core';
import { useCallback } from 'react';

export const useBankConnection = (): {
  connectionStatus:
    | IPickRequest<
        AccountsCommands,
        'CheckBankConnectionStatusCommand'
      >['response']
    | undefined;
  authorise: (institution: IPossbileInstitution) => Promise<void>;
  disconnect: () => Promise<void>;
} => {
  const { data: connectionStatus } = useData({
    query: 'CheckBankConnectionStatusCommand',
    refreshOn: ['BankIntegrationDisconnected'],
  });

  const { execute: authoriseCommand } = useRequest('AuthoriseBankCommand');
  const { execute: disconnect } = useRequest('DisconnectBankConnectionCommand');

  const authorise = useCallback(
    async (institution: IPossbileInstitution) => {
      const response = await authoriseCommand({ bankId: institution.id });

      if (response) {
        window.location.href = response.authUrl;
      }
    },
    [authoriseCommand]
  );

  return { connectionStatus, authorise, disconnect };
};
