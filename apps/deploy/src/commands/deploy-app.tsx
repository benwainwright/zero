import { command, string } from '@drizzle-team/brocli';
import { render } from 'ink';
import { StackSelectionStrategy } from '@aws-cdk/toolkit-lib';
import { CdkUx } from '@zero/cdk-ux';

export const deployApp = command({
  name: 'deploy-app',
  options: {
    assemblyDir: string().required(),
    environment: string().enum('production', 'staging').required(),
  },
  handler: async ({ assemblyDir }) => {
    const { waitUntilExit } = render(
      <CdkUx
        includeMessageLevels={['error', 'info', 'result', 'warn']}
        onLoad={async (toolkit) => {
          const app = await toolkit.fromAssemblyDirectory(assemblyDir);
          await toolkit.deploy(app, {
            stacks: { strategy: StackSelectionStrategy.ALL_STACKS },
          });
        }}
      />,
      { patchConsole: false }
    );

    await waitUntilExit();
  },
});
