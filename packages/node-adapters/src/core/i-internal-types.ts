import type { ConfigValue } from '@zero/bootstrap';
import type EventEmitter from 'node:events';
import type { S3CompatibleClient } from './s3-client.ts';

export interface IInternalTypes {
  EventBusListener: EventEmitter;
  BusNamespace: string;
  StoragePath: ConfigValue<string>;
  StorageBucketRegion: ConfigValue<string | undefined>;
  StorageBucketEndpoint: ConfigValue<string | undefined>;
  StorageBucketName: ConfigValue<string>;
  StorageBucketAccessKeyId: ConfigValue<string | undefined>;
  StorageBucketSecretAccessKey: ConfigValue<string | undefined>;
  S3Client: S3CompatibleClient;
}
