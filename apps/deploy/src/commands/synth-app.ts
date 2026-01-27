import { command, string } from '@drizzle-team/brocli';
import { Toolkit, ToolkitError } from '@aws-cdk/toolkit-lib';
import { getZeroAppCloudAssembly } from '../zero-app-cloud-assembly';

export const synthApp = command({
  name: 'synth-app',
  options: {
    environment: string().enum('production', 'staging').required(),
    account: string().required(),
    region: string().required(),
    appVersion: string().required(),
    domainName: string().required(),
  },
  handler: async ({ region, account, environment, appVersion, domainName }) => {
    try {
      const toolkit = new Toolkit();
      const assembly = await getZeroAppCloudAssembly({
        region,
        account,
        domainName,
        environment,
        version: appVersion,
      });

      await toolkit.synth(assembly);
    } catch (error) {
      if (ToolkitError.isAssemblyError(error)) {
        const causeString =
          error.cause && error.cause instanceof Error
            ? `[${error.cause.message}]`
            : ``;
        console.error('CDK app error:', error.message, causeString);
      } else if (ToolkitError.isToolkitError(error)) {
        console.error('CDK Toolkit error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
      throw error;
    }
  },
});
