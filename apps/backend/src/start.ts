import { databaseAdaptersModule } from './database.ts';

import { getBootstrapper } from '@zero/bootstrap';
import { applicationCoreModule } from '@zero/application-core';
import { authModule } from '@zero/auth';
import { websocketServerModule } from '@zero/websocket-adapter/server';
import { accountsModule } from '@zero/accounts';
import { nodeAdaptersModule } from '@zero/node-adapters';
import { integrationsModule } from '@zero/integration-adapters';

const start = async () => {
  const bootstrapper = await getBootstrapper();

  bootstrapper.addModule(databaseAdaptersModule);
  bootstrapper.addModule(applicationCoreModule);
  bootstrapper.addModule(nodeAdaptersModule);
  bootstrapper.addModule(authModule);
  bootstrapper.addModule(integrationsModule);
  bootstrapper.addModule(accountsModule);
  bootstrapper.addModule(websocketServerModule);

  await bootstrapper.start();
};

start().catch((error: unknown) => {
  console.log(error);
});
