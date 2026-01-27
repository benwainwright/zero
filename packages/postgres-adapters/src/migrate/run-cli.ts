import { run } from '@drizzle-team/brocli';
import { migrateCommand } from './migrate-command.ts';
import { dropAllCommand } from './drop-all-command.ts';

run([dropAllCommand, migrateCommand]).catch((error) => console.log(error));
