import type { ResourceStatus } from '@aws-sdk/client-cloudformation';

export interface IDeployment {
  id: string;
  stack: string;
  completed: number;
  resources: Record<
    string,
    {
      type: string;
      status: ResourceStatus;
    }
  >;

  total: number;
}
