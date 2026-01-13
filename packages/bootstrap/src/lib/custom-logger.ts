import { BaseLogger, type ILogObjMeta, type ISettingsParam } from 'tslog';

export class CustomLogger<LogObj> extends BaseLogger<LogObj> {
  public constructor(settings?: ISettingsParam<LogObj>, logObj?: LogObj) {
    super(settings, logObj, 5);
  }

  public fatal(...args: unknown[]): (LogObj & ILogObjMeta) | undefined {
    return super.log(7, 'fatal', ...args);
  }

  public error(...args: unknown[]): (LogObj & ILogObjMeta) | undefined {
    return super.log(6, 'error', ...args);
  }

  public warn(...args: unknown[]): (LogObj & ILogObjMeta) | undefined {
    return super.log(5, 'warn', ...args);
  }

  public info(...args: unknown[]): (LogObj & ILogObjMeta) | undefined {
    return super.log(4, 'info', ...args);
  }

  public debug(...args: unknown[]): (LogObj & ILogObjMeta) | undefined {
    return super.log(3, 'debug', ...args);
  }

  public trace(...args: unknown[]): (LogObj & ILogObjMeta) | undefined {
    return super.log(2, 'trace', ...args);
  }

  public verbose(...args: unknown[]): (LogObj & ILogObjMeta) | undefined {
    return super.log(1, 'verbose', ...args);
  }

  public silly(...args: unknown[]): (LogObj & ILogObjMeta) | undefined {
    return super.log(0, 'silly', ...args);
  }
}
