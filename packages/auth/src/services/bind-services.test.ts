import { TypedContainerModule } from '@inversifyjs/strongly-typed';
import { bindServices } from './bind-services.ts';
import { containerWithAuthDepsMocked } from '@test-helpers';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

describe('bind services', () => {
  it('calls bind all all of the command handlers', async () => {
    const module = new TypedContainerModule((load) => {
      bindServices(load);
    });

    const { container } = containerWithAuthDepsMocked();
    container.load(module);

    const files = await readdir(join(__dirname, 'command-handlers'));

    const handlerFiles = files.filter((file) => !file.endsWith('test.ts'));

    const commandHandlers = await container.getAllAsync('CommandHandler');

    expect(commandHandlers).toHaveLength(handlerFiles.length);
  });

  it('calls bind all all of the query handlers', async () => {
    const module = new TypedContainerModule((load) => {
      bindServices(load);
    });

    const { container } = containerWithAuthDepsMocked();
    container.load(module);

    const files = await readdir(join(__dirname, 'query-handlers'));

    const handlerFiles = files.filter((file) => !file.endsWith('test.ts'));

    const queryHandlers = await container.getAllAsync('QueryHandler');

    expect(queryHandlers).toHaveLength(handlerFiles.length);
  });
});
