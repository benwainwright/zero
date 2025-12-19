import { DECORATOR_PRIORITY_KEY } from './priority.ts';

export const getPriority = <TFunction extends Function>(target: TFunction) => {
  return Reflect.getMetadata(DECORATOR_PRIORITY_KEY, target);
};
