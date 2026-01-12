import { ConfigValue } from '@zero/bootstrap';
import { S3ObjectStore } from './s3-object-store.ts';
import { createS3Client } from 'mock-aws-s3-v3';
import { mock } from 'vitest-mock-extended';
import { mkdtemp } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { S3CompatibleClient } from '@core';
import { objectStoreTests } from './object-store-tests.ts';

import FakeS3 from 'fake-s3';
import { S3Client } from '@aws-sdk/client-s3';

const server = new FakeS3({
  buckets: ['zero-storage'],
});

beforeEach(async () => {
  await server.start();
});

afterEach(async () => {
  await server.start();
});

export const creator = async () => {
  const folder = await mkdtemp(join(tmpdir(), 'zero-s3-client-tests'));
  const client = createS3Client({
    localDirectory: folder,
    bucket: 'zero-storage',
  });

  const clientContainer = mock<S3CompatibleClient>({
    async get() {
      return new S3Client({
        endpoint: `http://${server.hostPort}`,
        credentials: {
          secretAccessKey: `123`,
          accessKeyId: `abc`,
        },
      });
    },
  });

  return new S3ObjectStore(
    new ConfigValue(Promise.resolve('zero-storage')),
    clientContainer
  );
};

objectStoreTests(creator);
