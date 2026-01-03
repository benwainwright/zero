import { type ICommand } from '@types';

export type ICommandParamsOrUndefined<T extends ICommand<string>> = T extends {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}
  ? T['params']
  : undefined;
