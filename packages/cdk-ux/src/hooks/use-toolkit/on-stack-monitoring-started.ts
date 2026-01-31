import type { Host } from '@lib';
import type { IDeployableStack } from '@types';

export const onStackMonitoringStarted = (
  host: Host,
  setDeployments: (value: React.SetStateAction<IDeployableStack[]>) => void
) => {
  host.on('CDK_TOOLKIT_I5501', async (message) => {
    setDeployments((current) => {
      return current.map((deployment) => {
        return deployment.name === message.data.stack.stackName
          ? {
              ...deployment,
              deployments: [
                {
                  id: message.data.deployment,
                  resources: {},
                  total: message.data.resourcesTotal ?? 0,
                  completed: 0,
                  stack: message.data.stack.stackName,
                },
              ],
            }
          : deployment;
      });
    });
  });
};
