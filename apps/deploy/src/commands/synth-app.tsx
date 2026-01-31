import { command, string } from '@drizzle-team/brocli';
import { getZeroAppCloudAssembly } from '../zero-app-cloud-assembly.ts';
import { CdkUx } from '@zero/cdk-ux';
import { render } from 'ink';

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
    const { waitUntilExit } = render(
      <CdkUx
        onLoad={async (toolkit) => {
          const assembly = await getZeroAppCloudAssembly({
            region,
            account,
            domainName,
            environment,
            version: appVersion,
          });
          await toolkit.synth(assembly);
        }}
      />
    );

    await waitUntilExit();
  },
});
