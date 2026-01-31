import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import type { Construct } from 'constructs';

export const getParamStoreSecureStringParam =
  (context: Construct, environment: 'staging' | 'production') =>
  (key: string) =>
    StringParameter.fromSecureStringParameterAttributes(
      context,
      `${key}-param`,
      { parameterName: `/zero/${environment}/${key}` }
    );
