import { App } from 'aws-cdk-lib';
import { ZeroBuildStack } from './zero-build-stack';

const app = new App();

new ZeroBuildStack(app, {
  awsEnv: { region: 'eu-west-2', account: '688567288532' },
});

app.synth();
