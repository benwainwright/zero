import type { Host } from '@lib';
import type { IDeployableStack } from '@types';

export const onStackDeployProgress = (
  host: Host,
  setDeployments: (value: React.SetStateAction<IDeployableStack[]>) => void
) => {
  host.on('CDK_TOOLKIT_I5100', (message) => {
    setDeployments((current) => {
      return [
        ...current,
        {
          deployments: [],
          name: message.data.stack.stackName,
          status: 'started',
        },
      ];
    });
  });
};
