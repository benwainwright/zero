import { type IDeployment } from './i-deployment.ts';

export interface IDeployableStack {
  status: 'started' | 'completed' | 'error';
  name: string;
  deployments: IDeployment[];
}
