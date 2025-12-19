import EventEmitter from 'events';
import { readFileSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import z, { ZodError } from 'zod';
import * as z4 from 'zod/v4/core';

import { ConfigValue } from './config-value.ts';
import { type ILogger, type IBootstrapper } from '@types';
import { injectable, type ServiceIdentifier } from 'inversify';
import { inject } from './typed-inject.ts';

export const LOG_CONTEXT = { context: 'bootstrapper' };

const RESOLVE_CONFIG = 'resolve-config';

export const BootstrapConfigFileToken: ServiceIdentifier<string> = Symbol.for(
  'BootstrapConfigFileToken'
);

@injectable()
export class Bootstrapper implements IBootstrapper {
  private bootstrappingSteps: (() => Promise<void>)[] = [];
  private emitter = new EventEmitter();
  private fullSchema: Record<string, z4.$ZodType> = {};

  private _config: Record<string, unknown>;

  public constructor(
    @inject('ConfigFile')
    private configFile: string,

    @inject('Logger')
    private logger: ILogger
  ) {
    this.logger.silly('Initialising bootstrapper', {
      context: 'bootstrapper',
    });
    const configFilePath = join(cwd(), this.configFile);

    this._config = JSON.parse(readFileSync(configFilePath, 'utf-8')) as Record<
      string,
      unknown
    >;
  }

  public addInitStep(callback: () => Promise<void>) {
    this.bootstrappingSteps.push(callback);
  }

  public async start(): Promise<void> {
    this.logger.debug(`Starting application`, LOG_CONTEXT);
    try {
      z.object(this.fullSchema).parse(this._config);
    } catch (error) {
      if (error instanceof ZodError) {
        this.logger.error(z.prettifyError(error), LOG_CONTEXT);
        return;
      }
    }

    this.logger.debug(
      `Application config ${JSON.stringify(this._config)}`,
      LOG_CONTEXT
    );

    this.emitter.emit(RESOLVE_CONFIG);
    await this.bootstrappingSteps.reduce(async (last, current) => {
      await last;
      await current();
    }, Promise.resolve());
  }

  public configValue<TConfigValue extends z4.$ZodType>(
    key: string,
    schema: TConfigValue
  ): ConfigValue<z4.output<TConfigValue>> {
    const value = this._config[key];
    this.fullSchema[key] = schema;

    const valuePromise = new Promise<z4.output<TConfigValue>>((accept) =>
      this.emitter.on(RESOLVE_CONFIG, () => {
        accept(value as z4.output<TConfigValue>);
      })
    );

    return new ConfigValue(valuePromise);
  }
}
