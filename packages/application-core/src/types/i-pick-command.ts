import type { ICommand } from './i-command.ts';

export type IPickCommand<
  TCommands extends ICommand<string>,
  TKey extends TCommands['key']
> = Extract<TCommands, { key: TKey }>;
