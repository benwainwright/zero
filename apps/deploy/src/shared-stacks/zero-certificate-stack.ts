import { Stack } from 'aws-cdk-lib';
import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import type { Construct } from 'constructs';
import { CERT_STACK_NAME } from '../constants.ts';

interface ZeroCertificateStackProps {
  awsEnv: {
    account: string;
  };
  domainName: string;
}

export class ZeroCertificateStack extends Stack {
  public readonly certificate: Certificate;

  public constructor(context: Construct, props: ZeroCertificateStackProps) {
    super(context, CERT_STACK_NAME, {
      env: { ...props.awsEnv, region: 'us-east-1' },
    });

    const zeroHostedZone = HostedZone.fromLookup(this, `zero-hosted-zone`, {
      domainName: props.domainName,
    });

    this.certificate = new Certificate(this, 'zero-certificate', {
      domainName: `*.${props.domainName}`,
      validation: CertificateValidation.fromDns(zeroHostedZone),
    });
  }
}
