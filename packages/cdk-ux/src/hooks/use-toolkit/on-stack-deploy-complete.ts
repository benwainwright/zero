import type { Host } from '@lib';
import type { IDeployableStack } from '@types';

export const onStackDeployComplete = (
  host: Host,
  setDeployments: (value: React.SetStateAction<IDeployableStack[]>) => void
) => {
  host.on('CDK_TOOLKIT_I5900', (message) => {
    setDeployments((current) => {
      return current.map((deployment) =>
        message.data.stackArn.includes(deployment.name)
          ? {
              ...deployment,
              status: 'completed',
            }
          : deployment
      );
    });
  });
};
