import { StackSelectionStrategy, Toolkit } from '@aws-cdk/toolkit-lib';
import { command, string } from '@drizzle-team/brocli';
import { ECR_STACK_NAME } from '../constants.ts';

export const deployEcr = command({
  name: 'deploy-ecr',
  options: {
    assemblyDir: string().required(),
  },
  handler: async ({ assemblyDir }) => {
    const toolkit = new Toolkit();

    const source = await toolkit.fromAssemblyDirectory(assemblyDir);

    await toolkit.deploy(source, {
      stacks: {
        strategy: StackSelectionStrategy.PATTERN_MUST_MATCH,
        patterns: [ECR_STACK_NAME],
      },
    });
  },
});
