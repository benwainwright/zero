import { App } from 'aws-cdk-lib';
import { ZeroStack } from './zero-stack.ts';

const app = new App();

const account = process.env['IS_LOCAL'] ? '000000000000' : '688567288532';
const region = 'eu-west-2';

new ZeroStack(app, {
  environment: 'dev',
  awsEnv: {
    account,
    region,
  },
});

app.synth();
