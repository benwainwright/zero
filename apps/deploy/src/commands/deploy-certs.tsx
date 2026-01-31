import { StackSelectionStrategy } from '@aws-cdk/toolkit-lib';
import { command, string } from '@drizzle-team/brocli';
import { CERT_STACK_NAME } from '../constants.ts';
import { CdkUx } from '@zero/cdk-ux';
import { render } from 'ink';

export const deployCerts = command({
  name: 'deploy-certs',
  options: {
    assemblyDir: string().required(),
  },
  handler: async ({ assemblyDir }) => {
    const { waitUntilExit } = render(
      <CdkUx
        onLoad={async (toolkit) => {
          const source = await toolkit.fromAssemblyDirectory(assemblyDir);
          await toolkit.deploy(source, {
            stacks: {
              strategy: StackSelectionStrategy.PATTERN_MUST_MATCH,
              patterns: [CERT_STACK_NAME],
            },
          });
        }}
      />
    );
    await waitUntilExit();
  },
});
