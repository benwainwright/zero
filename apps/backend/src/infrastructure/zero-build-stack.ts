import { Stack } from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import { BUILD_STACK_NAME } from './constants';
import { join } from 'path';

interface ZeroBuildStackProps {
  awsEnv: {
    account: string;
    region: string;
  };
}

export class ZeroBuildStack extends Stack {
  public readonly image: DockerImageAsset;

  public constructor(context: Construct, props: ZeroBuildStackProps) {
    super(context, BUILD_STACK_NAME, {
      env: props.awsEnv,
      crossRegionReferences: true,
    });

    const directory = join(__dirname, '..', '..');

    this.image = new DockerImageAsset(this, `zero-docker-build`, {
      directory,
    });
  }
}
