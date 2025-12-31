import { type ICommand } from '@types';

export type ICommandParamsOrUndefined<T extends ICommand<string>> = T extends {
  params: any;
}
  ? T['params']
  : undefined;
