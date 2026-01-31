import type { Host } from '@lib';
import type { IDeployableStack } from '@types';

export const onStackMonitoringFinish = (
  host: Host,
  setDeployments: (value: React.SetStateAction<IDeployableStack[]>) => void
) => {
  host.on('CDK_TOOLKIT_I5503', (message) => {
    setDeployments((current) =>
      current.map((deployment) =>
        deployment.name === message.data.stackName
          ? {
              ...deployment,
              deployments: deployment.deployments.map((theDeployment) =>
                theDeployment.id === message.data.deployment
                  ? {
                      ...theDeployment,
                      completed: message.data.resourcesTotal ?? 0,
                      total: message.data.resourcesTotal ?? 0,
                    }
                  : theDeployment
              ),
            }
          : deployment
      )
    );
  });
};
