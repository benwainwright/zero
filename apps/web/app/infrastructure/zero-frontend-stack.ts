import type { FrontendConfig } from '@zero/backend';
import { Stack } from 'aws-cdk-lib';
import type { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Distribution, ViewerProtocolPolicy } from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import type { Construct } from 'constructs';
import path from 'path';

const INDEX_DOT_HTML = 'index.html';

interface ZeroFrontendStackProps {
  stackName: string;
  environment: `staging` | `production`;
  config: FrontendConfig;
  awsEnv: {
    account: string;
    region: string;
  };
  domainName: string;
  certificate: ICertificate;
}

export class ZeroFrontendStack extends Stack {
  public constructor(context: Construct, props: ZeroFrontendStackProps) {
    super(context, props.stackName, {
      env: props.awsEnv,
      crossRegionReferences: true,
    });

    const bucket = new Bucket(this, 'zero-frontend-assets-bucket', {
      publicReadAccess: true,
      websiteIndexDocument: INDEX_DOT_HTML,
      websiteErrorDocument: INDEX_DOT_HTML,
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS_ONLY,
    });

    const domainName =
      props.environment === 'production'
        ? props.domainName
        : `${props.environment}.${props.domainName}`;

    const distribution = new Distribution(
      this,
      'zero-frontend-cloudfront-distro',
      {
        certificate: props.certificate,
        domainNames: [domainName],
        defaultBehavior: {
          origin: S3BucketOrigin.withBucketDefaults(bucket),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
      }
    );

    const buildDir = path.join(__dirname, '..', '..', 'build', 'client');

    new BucketDeployment(this, 'zero-frontend-deployment', {
      destinationBucket: bucket,
      distribution,
      sources: [
        Source.asset(buildDir),
        Source.jsonData('config.json', props.config),
      ],
    });

    const zeroHostedZone = HostedZone.fromLookup(this, `zero-hosted-zone`, {
      domainName: props.domainName,
    });

    new ARecord(this, 'zero-frontend-a-record', {
      zone: zeroHostedZone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
  }
}
