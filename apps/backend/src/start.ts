import { getBootstrapper } from '@zero/bootstrap';
import { applicationCoreModule } from '@zero/application-core';
import { authModule } from '@zero/auth';
import { databaseAdaptersModule } from './database.ts';
import { websocketServerModule } from '@zero/websocket-adapter/server';
import { nodeAdaptersModule } from '@zero/node-adapters';

const start = async () => {
  const bootstrapper = await getBootstrapper();

  bootstrapper.addModule(databaseAdaptersModule);
  bootstrapper.addModule(applicationCoreModule);
  bootstrapper.addModule(nodeAdaptersModule);
  bootstrapper.addModule(authModule);
  bootstrapper.addModule(websocketServerModule);

  await bootstrapper.start();
};

start().catch((error: unknown) => {
  console.log(error);
});
