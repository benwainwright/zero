import { databaseAdaptersModule } from './database.ts';
import { storageAdapterModule } from './storage.ts';

import { command, string } from '@drizzle-team/brocli';
import { getBootstrapper } from '@zero/bootstrap';
import { applicationCoreModule } from '@zero/application-core';
import { healthcheckModule } from '@zero/healthcheck';
import { authModule } from '@zero/auth';
import { websocketServerModule } from '@zero/websocket-adapter/server';
import { accountsModule } from '@zero/accounts';
import { nodeAdaptersModule } from '@zero/node-adapters';
import { integrationsModule } from '@zero/integration-adapters';

export const startCommand = command({
  name: 'start',
  options: {
    config: string().default('zero.config.json'),
    logger: string().enum('pretty', 'json').default('pretty'),
  },
  handler: async (options) => {
    const bootstrapper = await getBootstrapper(options.config, options.logger);
    bootstrapper.addModule(databaseAdaptersModule);
    bootstrapper.addModule(storageAdapterModule);
    bootstrapper.addModule(applicationCoreModule);
    bootstrapper.addModule(nodeAdaptersModule);
    bootstrapper.addModule(authModule);
    bootstrapper.addModule(integrationsModule);
    bootstrapper.addModule(accountsModule);
    bootstrapper.addModule(websocketServerModule);
    bootstrapper.addModule(healthcheckModule);

    await bootstrapper.start();
  },
});
