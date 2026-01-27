import { run } from '@drizzle-team/brocli';
import { synthApp } from './commands/synth-app';
import { deployEcr } from './commands/deploy-ecr';

run([synthApp, deployEcr]);
