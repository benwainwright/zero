import { run } from '@drizzle-team/brocli';
import { synthApp } from './commands/synth-app.tsx';
import { deployEcr } from './commands/deploy-ecr.ts';
import { deployApp } from './commands/deploy-app.tsx';

run([synthApp, deployEcr, deployApp]);
