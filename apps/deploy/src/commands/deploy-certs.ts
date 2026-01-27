import { StackSelectionStrategy, Toolkit } from '@aws-cdk/toolkit-lib';
import { command, string } from '@drizzle-team/brocli';
import { CERT_STACK_NAME } from '../constants';

export const deployCerts = command({
  name: 'deploy-certs',
  options: {
    assemblyDir: string().required(),
  },
  handler: async ({ assemblyDir }) => {
    const toolkit = new Toolkit();

    const source = await toolkit.fromAssemblyDirectory(assemblyDir);

    await toolkit.deploy(source, {
      stacks: {
        strategy: StackSelectionStrategy.PATTERN_MUST_MATCH,
        patterns: [CERT_STACK_NAME],
      },
    });
  },
});
