import { GocardlessClient } from './gocardless/gocardless-client.ts';
import z from 'zod';
import type { IInternalTypes } from '@core';
import { ObjectStorageResponseCache } from '@http-client';
import type { IModule } from '@zero/bootstrap';
import type { IAccountsTypes } from '@zero/accounts';

export const LOG_CONTEXT = { context: 'integrations-module' };

export const integrationsModule: IModule<
  IInternalTypes & IAccountsTypes
> = async ({ bind, logger, configValue }) => {
  logger.info(`Initialising integrations module`, LOG_CONTEXT);

  bind('OpenBankingAccountBalanceFetcher').to(GocardlessClient);
  bind('OpenBankingTokenRefresher').to(GocardlessClient);
  bind('BankConnectionTokenFetcher').to(GocardlessClient);
  bind('ResponseCache').to(ObjectStorageResponseCache).inSingletonScope();
  bind('OpenBankingClient').to(GocardlessClient);
  bind('GocardlessRedirectUrlConfigValue').toConstantValue(
    configValue({
      namespace: 'gocardless',
      key: 'redirectUrl',
      description:
        'Application path that the gocardless URL will redirect back to once authorisation is finished',
      schema: z.string(),
    })
  );

  bind('GocardlessClientSecretIdConfigValue').toConstantValue(
    configValue({
      schema: z.string(),
      namespace: 'gocardless',
      key: 'secretId',
      description: 'Secret ID provided from the Gocardless portal',
    })
  );

  bind('GocardlessClientSecretKeyConfigValue').toConstantValue(
    configValue({
      namespace: 'gocardless',
      key: 'secretKey',
      description: 'Secret Key provided from the Gocardless portal',
      schema: z.string(),
    })
  );

  logger.debug(`Finished initialising integrations module`, LOG_CONTEXT);
};
