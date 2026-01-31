import { command, string } from '@drizzle-team/brocli';
import { withErrorHandling } from './with-error-handling.ts';
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
    await withErrorHandling(async () => {
      const { waitUntilExit } = render(
        <CdkUx
          onLoad={async (toolkit) => {
            const app = await toolkit.fromAssemblyDirectory(assemblyDir);
            await toolkit.deploy(app, {
              stacks: { strategy: StackSelectionStrategy.ALL_STACKS },
            });
          }}
        />
      );

      await waitUntilExit();
    });
  },
});
