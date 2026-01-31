import type { Host } from '@lib';
import type { IDeployableStack } from '@types';

export const onStackActivity = (
  host: Host,
  setDeployments: (value: React.SetStateAction<IDeployableStack[]>) => void
) => {
  host.on('CDK_TOOLKIT_I5502', (message) => {
    const { event } = message.data;

    const addStatus =
      event.LogicalResourceId && event.ResourceStatus && event.ResourceType
        ? {
            [event.LogicalResourceId]: {
              type: event.ResourceType,
              status: event.ResourceStatus,
              reason: event.ResourceStatusReason,
            },
          }
        : {};

    setDeployments((current) => {
      return current.map((deployment) =>
        deployment.deployments.find(
          (theDeployment) => message.data.deployment === theDeployment.id
        )
          ? {
              ...deployment,
              deployments: deployment.deployments.map((theDeployment) =>
                theDeployment.id === message.data.deployment
                  ? {
                      ...theDeployment,
                      completed: message.data.progress.completed,
                      total: message.data.progress.total ?? 0,
                      resources: {
                        ...theDeployment.resources,
                        ...addStatus,
                      },
                    }
                  : theDeployment
              ),
            }
          : deployment
      );
    });
  });
};
