import { Stack } from 'aws-cdk-lib';
import { Repository } from 'aws-cdk-lib/aws-ecr';
import type { Construct } from 'constructs';
import { ECR_STACK_NAME } from '../constants.ts';

interface ZeroEcrStackProps {
  awsEnv: {
    account: string;
    region: string;
  };
}

export class ZeroEcrStack extends Stack {
  public repository: Repository;

  public constructor(context: Construct, props: ZeroEcrStackProps) {
    super(context, ECR_STACK_NAME, {
      env: props.awsEnv,
    });

    this.repository = new Repository(this, `zero-ecr`);
  }
}
