import { type ILogObj } from 'tslog';

import { CustomLogger } from './custom-logger.ts';

export const getLogger = (type: 'pretty' | 'json') => {
  const logger = new CustomLogger<ILogObj>({ type });

  const newLogger = (theLogger: CustomLogger<ILogObj>) => {
    const getChildLogger = (name: string) => {
      return newLogger(
        theLogger.getSubLogger({ name }) as CustomLogger<ILogObj>
      );
    };

    return {
      debug: logger.debug.bind(logger),
      info: logger.info.bind(logger),
      error: logger.error.bind(logger),
      warn: logger.warn.bind(logger),
      verbose: logger.verbose.bind(logger),
      silly: logger.silly.bind(logger),
      fatal: logger.fatal.bind(logger),
      child: getChildLogger,
    };
  };

  return newLogger(logger);
};
