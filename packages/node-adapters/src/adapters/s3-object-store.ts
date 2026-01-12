import type { IObjectStorage } from '@zero/application-core';
import { injectable } from 'inversify';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { inject, type S3CompatibleClient } from '@core';
import type { ConfigValue } from '@zero/bootstrap';

@injectable()
export class S3ObjectStore implements IObjectStorage {
  public constructor(
    @inject('StorageBucketName')
    private readonly bucketName: ConfigValue<string>,

    @inject('S3Client')
    private readonly client: S3CompatibleClient
  ) {}

  public async listKeys(namespace: string): Promise<string[]> {
    const client = await this.client.get();
    const command = new ListObjectsCommand({
      Bucket: await this.bucketName.value,
      Prefix: `${namespace}/`,
    });

    const result = await client.send(command);

    return (result.Contents?.map((item) => item.Key) ?? []).flatMap((item) =>
      item ? [item] : []
    );
  }

  public async get(
    namespace: string,
    key: string
  ): Promise<string | undefined> {
    const client = await this.client.get();

    const command = new GetObjectCommand({
      Bucket: await this.bucketName.value,
      Key: `${namespace}/${key}`,
    });

    const result = await client.send(command);

    if (!result) {
      return undefined;
    }

    return await result.Body?.transformToString();
  }

  public async set(
    namespace: string,
    key: string,
    thing: string | undefined
  ): Promise<void> {
    const client = await this.client.get();

    const command = thing
      ? new PutObjectCommand({
          Bucket: await this.bucketName.value,
          Key: `${namespace}/${key}`,
          Body: thing,
        })
      : new DeleteObjectCommand({
          Bucket: await this.bucketName.value,
          Key: `${namespace}/${key}`,
        });

    await client.send(command);
  }

  public async clear(namespace: string): Promise<void> {
    const client = await this.client.get();
    const keys = await this.listKeys(namespace);

    const command = new DeleteObjectsCommand({
      Bucket: await this.bucketName.value,
      Delete: {
        Objects: keys.map((item) => ({ Key: item })),
      },
    });

    await client.send(command);
  }
}
