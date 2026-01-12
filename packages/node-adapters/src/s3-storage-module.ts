import type { IModule } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';
import { S3CompatibleClient, type IInternalTypes } from '@core';
import z from 'zod';
import { S3ObjectStore } from '@adapters';

export const s3StorageModule: IModule<
  IInternalTypes & IApplicationTypes
> = async ({ bind, configValue }) => {
  bind('ObjectStore').to(S3ObjectStore);
  bind('S3Client').to(S3CompatibleClient);

  const storageBucket = configValue({
    namespace: 's3',
    key: 'bucketName',
    schema: z.string(),
    description: 'S3 compatible object storage bucket name',
  });

  const storageEndpoint = configValue({
    namespace: 's3',
    key: 'endpoint',
    schema: z.string(),
    description: 'S3 compatible object storage endpoint',
  });

  const storageRegion = configValue({
    namespace: 's3',
    key: 'region',
    schema: z.string(),
    description: 'S3 compatible object storage region',
  });

  const storageAccessKeyId = configValue({
    namespace: 's3',
    key: 'accessKeyId',
    schema: z.string(),
    description: 'S3 compatible access key ID',
  });

  const storageSecretAccessKey = configValue({
    namespace: 's3',
    key: 'secretAccessKey',
    schema: z.string(),
    description: 'S3 compatible secret access key',
  });

  bind('StorageBucketName').toConstantValue(storageBucket);
  bind('StorageBucketEndpoint').toConstantValue(storageEndpoint);
  bind('StorageBucketAccessKeyId').toConstantValue(storageAccessKeyId);
  bind('StorageBucketSecretAccessKey').toConstantValue(storageSecretAccessKey);
  bind('StorageBucketRegion').toConstantValue(storageRegion);
};
