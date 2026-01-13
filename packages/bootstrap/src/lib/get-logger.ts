import { type ILogObj } from 'tslog';

import { CustomLogger } from './custom-logger.ts';
import type { ILogger } from '@types';

export const getLogger = (type: 'pretty' | 'json') => {
  const logger = new CustomLogger<ILogObj>({ type, minLevel: 3 });

  const newLogger = (theLogger: CustomLogger<ILogObj>): ILogger => {
    const getChildLogger = <TData extends ILogObj>(
      name: string,
      data?: TData
    ) => {
      return newLogger(
        theLogger.getSubLogger(
          { name, minLevel: 3 },
          data
        ) as CustomLogger<ILogObj>
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
