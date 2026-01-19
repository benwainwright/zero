import { ConfigValue } from '@zero/bootstrap';
import { S3ObjectStore } from './s3-object-store.ts';
import { mock } from 'vitest-mock-extended';
import { S3CompatibleClient } from '@core';
import { objectStoreTests } from './object-store-tests.ts';

import {
  CreateBucketCommand,
  DeleteBucketCommand,
  DeleteObjectsCommand,
  ListObjectsCommand,
  S3Client,
} from '@aws-sdk/client-s3';

let client: S3Client;

beforeEach(async () => {
  client = new S3Client({
    endpoint: `http://localhost:4566`,
    forcePathStyle: true,
    region: 'us-east-1',
    credentials: {
      accessKeyId: 'test',
      secretAccessKey: 'test',
    },
  });
  await client.send(
    new CreateBucketCommand({
      Bucket: 'zero-storage',
    })
  );
});

afterEach(async () => {
  const objects = await client.send(
    new ListObjectsCommand({
      Bucket: 'zero-storage',
    })
  );
  const keys = objects.Contents?.map((item) => ({ Key: item.Key }));
  if ((keys?.length ?? 0) > 0) {
    await client.send(
      new DeleteObjectsCommand({
        Bucket: 'zero-storage',
        Delete: {
          Objects: keys,
        },
      })
    );
  }
  await client.send(
    new DeleteBucketCommand({
      Bucket: 'zero-storage',
    })
  );
  client.destroy();
});

export const creator = async () => {
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
