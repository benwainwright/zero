import { databaseAdaptersModule } from './database.ts';
import { storageAdapterModule } from './storage.ts';

import { command, string } from '@drizzle-team/brocli';
import { getBootstrapper } from '@zero/bootstrap';
import { applicationCoreModule } from '@zero/application-core';
import { authModule } from '@zero/auth';
import { websocketServerModule } from '@zero/websocket-adapter/server';
import { accountsModule } from '@zero/accounts';
import { nodeAdaptersModule } from '@zero/node-adapters';
import { integrationsModule } from '@zero/integration-adapters';

export const startCommand = command({
  name: 'start',
  options: { config: string().default('zero.config.json') },
  handler: async (options) => {
    const bootstrapper = await getBootstrapper(options.config);
    bootstrapper.addModule(databaseAdaptersModule);
    bootstrapper.addModule(storageAdapterModule);
    bootstrapper.addModule(applicationCoreModule);
    bootstrapper.addModule(nodeAdaptersModule);
    bootstrapper.addModule(authModule);
    bootstrapper.addModule(integrationsModule);
    bootstrapper.addModule(accountsModule);
    bootstrapper.addModule(websocketServerModule);

    await bootstrapper.start();
  },
});
