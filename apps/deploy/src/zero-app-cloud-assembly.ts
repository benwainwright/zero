import { ZeroBackendStack } from '@zero/backend';
import { Toolkit } from '@aws-cdk/toolkit-lib';
import { ZeroFrontendStack } from '@zero/web';
import { ZeroEcrStack } from './shared-stacks/zero-ecr-stack';
import { App } from 'aws-cdk-lib';
import { ZeroCertificateStack } from './shared-stacks/zero-certificate-stack';
import { frontendStackName } from './frontend-stack-name';
import { backendStackName } from './backend-stack-name';
import { join } from 'path';

interface IAppConfig {
  region: string;
  account: string;
  domainName: string;
  environment: 'production' | 'staging';
  version: string;
}

export const getZeroAppCloudAssembly = async ({
  region,
  account,
  domainName,
  environment,
  version,
}: IAppConfig) => {
  const toolkit = new Toolkit();
  return await toolkit.fromAssemblyBuilder(
    async () => {
      const app = new App();

      const ecrStack = new ZeroEcrStack(app, {
        awsEnv: {
          account,
          region,
        },
      });

      const certificateStack = new ZeroCertificateStack(app, {
        domainName,
        awsEnv: { account },
      });

      const { frontendConfig } = new ZeroBackendStack(app, {
        stackName: backendStackName(environment),
        repository: ecrStack.repository,
        environment,
        domainName,
        certificate: certificateStack.certificate,
        version,
        awsEnv: {
          account,
          region,
        },
      });

      new ZeroFrontendStack(app, {
        stackName: frontendStackName(environment),
        environment,
        config: frontendConfig,
        domainName,
        certificate: certificateStack.certificate,
        awsEnv: {
          region,
          account,
        },
      });

      return app.synth();
    },
    { outdir: join(__dirname, '..', 'cdk.out') }
  );
};
