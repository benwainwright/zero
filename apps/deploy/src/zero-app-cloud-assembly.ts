import { ZeroBackendStack, ZeroBuildStack } from '@zero/backend';
import { Toolkit } from '@aws-cdk/toolkit-lib';
import { ZeroFrontendStack } from '@zero/web';
import { App } from 'aws-cdk-lib';
import { ZeroCertificateStack } from './shared-stacks/zero-certificate-stack.ts';
import { frontendStackName } from './frontend-stack-name.ts';
import { backendStackName } from './backend-stack-name.ts';
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

      const certificateStack = new ZeroCertificateStack(app, {
        domainName,
        awsEnv: { account },
      });

      const buildStack = new ZeroBuildStack(app, {
        awsEnv: { account, region },
      });

      const { frontendConfig } = new ZeroBackendStack(app, {
        stackName: backendStackName(environment),
        image: buildStack.image,
        environment,
        domainName,
        certificate: certificateStack.certificate,
        version,
        awsEnv: {
          account,
          region,
        },
      });

      //Aspects.of(app).add(new AwsSolutionsChecks());

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
