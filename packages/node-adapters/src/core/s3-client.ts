import { S3Client } from '@aws-sdk/client-s3';
import { inject } from '@core';
import type { ConfigValue } from '@zero/bootstrap';
import { injectable, optional } from 'inversify';

@injectable()
export class S3CompatibleClient {
  public constructor(
    @optional()
    @inject('StorageBucketRegion')
    public readonly region: ConfigValue<string | undefined>,

    @optional()
    @inject('StorageBucketEndpoint')
    public readonly endpoint: ConfigValue<string | undefined>,

    @optional()
    @inject('StorageBucketAccessKeyId')
    public readonly secretAccessKeyId: ConfigValue<string | undefined>,

    @optional()
    @inject('StorageBucketSecretAccessKey')
    public readonly secretAcessKey: ConfigValue<string | undefined>
  ) {}

  public async get() {
    const endpoint = await this.endpoint.value;
    const region = await this.region.value;
    const keyId = await this.secretAccessKeyId.value;
    const secretAccessKey = await this.secretAcessKey.value;
    return new S3Client({
      ...(endpoint ? { endpoint } : {}),
      ...(region ? { region } : {}),
      ...(keyId && secretAccessKey
        ? {
            credentials: {
              secretAccessKey,
              accessKeyId: keyId,
            },
          }
        : {}),
    });
  }
}
