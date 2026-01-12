import { S3Client } from '@aws-sdk/client-s3';
import { inject } from '@core';
import type { ConfigValue } from '@zero/bootstrap';
import { injectable } from 'inversify';

@injectable()
export class S3CompatibleClient {
  public constructor(
    @inject('StorageBucketRegion')
    public readonly region: ConfigValue<string>,

    @inject('StorageBucketEndpoint')
    public readonly endpoint: ConfigValue<string>,

    @inject('StorageBucketAccessKeyId')
    public readonly secretAccessKeyId: ConfigValue<string>,

    @inject('StorageBucketSecretAccessKey')
    public readonly secretAcessKey: ConfigValue<string>
  ) {}

  public async get() {
    return new S3Client({
      endpoint: await this.endpoint.value,
      region: await this.region.value,
      credentials: {
        secretAccessKey: await this.secretAcessKey.value,
        accessKeyId: await this.secretAccessKeyId.value,
      },
    });
  }
}
