import type { IDeployableStack } from '@types';
import { Task } from 'ink-task-list';
import spinners from 'cli-spinners';
import type { ResourceStatus } from '@aws-sdk/client-cloudformation';

interface DeploymentCardProps {
  deployment: IDeployableStack;
}

type TaskListStatus = 'loading' | 'error' | 'success' | 'warning';

export const DeploymentCard = ({ deployment }: DeploymentCardProps) => {
  const statuses: Record<IDeployableStack['status'], TaskListStatus> = {
    started: 'loading',
    error: 'error',
    completed: 'success',
  };

  const mapResourceStatus: Record<ResourceStatus, TaskListStatus> = {
    CREATE_IN_PROGRESS: 'loading',
    UPDATE_ROLLBACK_IN_PROGRESS: 'loading',
    DELETE_IN_PROGRESS: 'loading',
    EXPORT_IN_PROGRESS: 'loading',
    IMPORT_IN_PROGRESS: 'loading',
    UPDATE_IN_PROGRESS: 'loading',
    ROLLBACK_IN_PROGRESS: 'loading',
    EXPORT_ROLLBACK_IN_PROGRESS: 'loading',
    IMPORT_ROLLBACK_IN_PROGRESS: 'loading',
    EXPORT_ROLLBACK_FAILED: 'error',
    IMPORT_FAILED: 'error',
    EXPORT_FAILED: 'error',
    CREATE_FAILED: 'error',
    DELETE_FAILED: 'error',
    IMPORT_ROLLBACK_FAILED: 'error',
    ROLLBACK_FAILED: 'error',
    UPDATE_FAILED: 'error',
    UPDATE_ROLLBACK_FAILED: 'error',
    ROLLBACK_COMPLETE: 'success',
    UPDATE_ROLLBACK_COMPLETE: 'success',
    UPDATE_COMPLETE: 'success',
    IMPORT_ROLLBACK_COMPLETE: 'success',
    EXPORT_ROLLBACK_COMPLETE: 'success',
    IMPORT_COMPLETE: 'success',
    CREATE_COMPLETE: 'success',
    DELETE_COMPLETE: 'success',
    EXPORT_COMPLETE: 'success',
    DELETE_SKIPPED: 'warning',
  };

  const resources = deployment.deployments.flatMap((deployment) =>
    Object.entries(deployment.resources)
  );
  return (
    <Task
      label={deployment.name}
      state={statuses[deployment.status]}
      spinner={spinners.dots}
      isExpanded={resources.length > 0}
    >
      {resources.map(([id, resource]) => (
        <Task
          spinner={spinners.dots}
          key={`resource-${id}-task`}
          label={id}
          status={resource.status}
          state={mapResourceStatus[resource.status]}
        />
      ))}
    </Task>
  );
};
