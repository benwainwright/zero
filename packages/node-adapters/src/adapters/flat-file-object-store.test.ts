import { mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { mock } from 'vitest-mock-extended';
import { FlatFileObjectStore } from './flat-file-object-store.ts';
import { ConfigValue, type ILogger } from '@zero/bootstrap';
import { objectStoreTests } from './object-store-tests.ts';

const creator = async () => {
  const folder = await mkdtemp(join(tmpdir(), 'zero-tests'));
  const path = new ConfigValue(Promise.resolve(folder));
  const logger = mock<ILogger>();
  return new FlatFileObjectStore(path, logger);
};

objectStoreTests(creator);
