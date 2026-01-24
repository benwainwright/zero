import { DECORATOR_PRIORITY_KEY } from './priority.ts';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const getPriority = <TFunction extends Function>(target: TFunction) => {
  return Reflect.getMetadata(DECORATOR_PRIORITY_KEY, target);
};
