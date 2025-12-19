export const DECORATOR_PRIORITY_KEY = `zero-decorators-priority`;

/**
 * When resolving decorators, this number will determine which instance goes
 * first in the decorator chain
 *
 * @param value
 * @returns
 */
export const priority = (value: number) => {
  const decorator: ClassDecorator = (target) => {
    Reflect.defineMetadata(DECORATOR_PRIORITY_KEY, value, target);
  };

  return decorator;
};
