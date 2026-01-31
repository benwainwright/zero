import { type IDeployableStack } from '@types';
import { DeploymentCard, Section, Spinner } from '@components';
import { TaskList } from 'ink-task-list';

interface DeploymentsProps {
  deployments: IDeployableStack[];
}
export const Deployments = ({ deployments }: DeploymentsProps) => {
  return deployments.length > 0 ? (
    <Section title="Deployments">
      <Spinner show={deployments.length === 0} text="loading" />
      <TaskList>
        {deployments.map((deployment) => (
          <DeploymentCard
            key={`${deployment.name}-deployment`}
            deployment={deployment}
          />
        ))}
      </TaskList>
    </Section>
  ) : null;
};
