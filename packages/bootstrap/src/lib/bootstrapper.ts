import EventEmitter from 'events';
import fs from 'fs';
import path from 'path';
import process from 'process';
import z, { type ZodRawShape, ZodError, type ZodType, type core } from 'zod';

import { ConfigValue } from './config-value.ts';
import {
  type ILogger,
  type IBootstrapper,
  type IBootstrapTypes,
  type RequestCallback,
} from '@types';
import { injectable, type ServiceIdentifier } from 'inversify';
import { inject } from '@inversify';
import type { TypedContainer } from '@inversifyjs/strongly-typed';
import type { BindingMap } from '@decorator-manager';

export const LOG_CONTEXT = { context: 'bootstrapper' };

const RESOLVE_CONFIG = 'resolve-config';

export const BootstrapConfigFileToken: ServiceIdentifier<string> = Symbol.for(
  'BootstrapConfigFileToken'
);

@injectable()
export class Bootstrapper implements IBootstrapper {
  private bootstrappingSteps: (() => Promise<void>)[] = [];
  private emitter = new EventEmitter();
  private fullSchema: Record<string, Record<string, ZodType>> = {};
  private readonly configDescriptions: Record<string, Record<string, string>> =
    {};

  private _config: Record<string, unknown>;

  private requestCallbacks: RequestCallback<BindingMap>[] = [];

  public constructor(
    @inject('ConfigFile')
    private configFile: string,

    @inject('Logger')
    private logger: ILogger
  ) {
    this.logger.silly('Initialising bootstrapper', {
      context: 'bootstrapper',
    });
    const configFilePath = path.join(process.cwd(), this.configFile);

    const rawConfig = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    this._config = this.ensureRecord(rawConfig);
  }

  public addInitStep(callback: () => Promise<void>) {
    this.bootstrappingSteps.push(callback);
  }

  public async executeRequestCallbacks<TTypeMap extends BindingMap>(
    requestContainer: TypedContainer<TTypeMap & IBootstrapTypes>
  ) {
    for (const callback of this.requestCallbacks) {
      await callback(requestContainer);
    }
  }

  public onRequest<TTypeMap extends BindingMap>(
    callback: RequestCallback<TTypeMap>
  ) {
    this.requestCallbacks.push(callback);
  }

  public async start(): Promise<void> {
    this.logger.info(`Starting application`, LOG_CONTEXT);
    try {
      this.ensureNamespacesPresent();
      z.object(this.buildSchema()).parse(this._config);
    } catch (error) {
      if (error instanceof ZodError) {
        this.logger.error(this.formatValidationError(error), {
          ...LOG_CONTEXT,
          error,
        });
        return;
      }
    }

    this.logger.debug(
      `Application config ${JSON.stringify(this._config)}`,
      LOG_CONTEXT
    );

    this.logger.info(`Running final initialisation steps`);

    this.emitter.emit(RESOLVE_CONFIG);
    await this.bootstrappingSteps.reduce(async (last, current) => {
      await last;
      await current();
    }, Promise.resolve());

    this.logger.info(`Application Initialised`);
  }

  public configValue<TConfigValue extends ZodType>({
    namespace,
    key,
    schema,
    description,
  }: {
    namespace: string;
    key: string;
    schema: TConfigValue;
    description: string;
  }): ConfigValue<core.output<TConfigValue>> {
    const namespacedConfig = this.ensureNamespacedConfig(namespace);
    const envKey = `ZERO_CONFIG_${namespace}_${key}`.toUpperCase();
    const envValue = process.env[envKey];

    const value =
      namespacedConfig[key] === undefined && envValue !== undefined
        ? envValue
        : namespacedConfig[key];
    if (namespacedConfig[key] === undefined && envValue !== undefined) {
      this._config[namespace] = {
        ...namespacedConfig,
        [key]: envValue,
      };
    }
    this.fullSchema[namespace] ??= {};
    this.fullSchema[namespace][key] = schema;

    this.configDescriptions[namespace] ??= {};
    this.configDescriptions[namespace][key] = description;

    const valuePromise = new Promise<core.output<TConfigValue>>((accept) =>
      this.emitter.on(RESOLVE_CONFIG, () => {
        accept(schema.parse(value));
      })
    );

    return new ConfigValue(valuePromise);
  }

  private ensureNamespacesPresent() {
    for (const namespace of Object.keys(this.fullSchema)) {
      if (this._config[namespace] === undefined) {
        this._config[namespace] = {};
      }
    }
  }

  private formatValidationError(error: ZodError): string {
    const missingMessages: string[] = [];
    const otherMessages: string[] = [];

    for (const issue of error.issues) {
      const path = issue.path.map(String);
      const pathLabel = path.join('.');
      const isMissing =
        issue.code === 'invalid_type' && issue.input === undefined;

      if (isMissing) {
        if (path.length >= 2) {
          const namespace = path[0];
          const key = path[1];
          if (namespace && key) {
            const description =
              this.configDescriptions[namespace]?.[key] ?? 'no description';
            missingMessages.push(
              `Missing config value: ${pathLabel} (${description})`
            );
          } else {
            missingMessages.push(
              `Missing config value: ${pathLabel || 'config'}`
            );
          }
        } else {
          missingMessages.push(
            `Missing config value: ${pathLabel || 'config'}`
          );
        }
        continue;
      }

      otherMessages.push(
        pathLabel ? `${pathLabel}: ${issue.message}` : issue.message
      );
    }

    return [...missingMessages, ...otherMessages].join('\n');
  }

  private buildSchema(): ZodRawShape {
    return Object.fromEntries(
      Object.entries(this.fullSchema).map(([namespace, configValues]) => [
        namespace,
        z.object(configValues as ZodRawShape),
      ])
    ) as ZodRawShape;
  }

  private ensureRecord(value: unknown): Record<string, unknown> {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }

    return {};
  }

  private ensureNamespacedConfig(namespace: string): Record<string, unknown> {
    const existing = this.ensureRecord(this._config[namespace]);
    this._config[namespace] = existing;
    return existing;
  }
}
