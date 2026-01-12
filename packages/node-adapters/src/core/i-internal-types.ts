import type { ConfigValue } from '@zero/bootstrap';
import type EventEmitter from 'node:events';
import type { S3CompatibleClient } from './s3-client.ts';

export interface IInternalTypes {
  EventBusListener: EventEmitter;
  BusNamespace: string;
  StoragePath: ConfigValue<string>;
  StorageBucketRegion: ConfigValue<string>;
  StorageBucketEndpoint: ConfigValue<string>;
  StorageBucketName: ConfigValue<string>;
  StorageBucketAccessKeyId: ConfigValue<string>;
  StorageBucketSecretAccessKey: ConfigValue<string>;
  S3Client: S3CompatibleClient;
}
