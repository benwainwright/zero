import { ConfigValue } from '@zero/bootstrap';
import { S3ObjectStore } from './s3-object-store.ts';
import { createS3Client } from 'mock-aws-s3-v3';
import { mock } from 'vitest-mock-extended';
import { mkdtemp } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { S3CompatibleClient } from '@core';
import { objectStoreTests } from './object-store-tests.ts';

export const creator = async () => {
  const folder = await mkdtemp(join(tmpdir(), 'zero-s3-client-tests'));
  console.log({ folder });
  const client = createS3Client({
    localDirectory: folder,
    bucket: 'zero-storage',
  });

  const clientContainer = mock<S3CompatibleClient>({
    async get() {
      return client;
    },
  });

  return new S3ObjectStore(
    new ConfigValue(Promise.resolve('zero-storage')),
    clientContainer
  );
};

objectStoreTests(creator);
