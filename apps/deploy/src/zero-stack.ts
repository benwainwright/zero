import { auroraDsql } from '@cdklabs/generative-ai-cdk-constructs';
import { Stack } from 'aws-cdk-lib';
import { IpAddresses, Vpc } from 'aws-cdk-lib/aws-ec2';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import type { Construct } from 'constructs';
import { join } from 'node:path';

const webDistFolder = join(import.meta.dirname, '..', 'dist', 'web');

interface ZeroStackProps {
  environment: 'prod' | 'dev';
  awsEnv: {
    region: string;
    account: string;
  };
}

export class ZeroStack extends Stack {
  public constructor(context: Construct, props: ZeroStackProps) {
    super(context, `zero-stack-${props.environment}`, { env: props.awsEnv });

    const websiteBucket = new Bucket(
      this,
      `zero-website-bucket-${props.environment}`,
      {
        publicReadAccess: true,
        blockPublicAccess: BlockPublicAccess.BLOCK_ACLS_ONLY,
        websiteIndexDocument: 'index.html',
      }
    );

    new BucketDeployment(
      this,
      `zero-website-bucket-deployment-${props.environment}`,
      {
        sources: [Source.asset(webDistFolder)],
        destinationBucket: websiteBucket,
      }
    );

    const vpc = new Vpc(this, `zero-app-host-${props.environment}`, {
      ipAddresses: IpAddresses.cidr('10.0.0.0/16'),
    });
  }
}
