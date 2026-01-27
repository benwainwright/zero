import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { cwd } from 'process';
import { Bootstrapper } from './bootstrapper.ts';
import z from 'zod';
import { mock } from 'vitest-mock-extended';
import type { ILogger } from '@types';
import type { IDecoratorManager } from '@decorator-manager';
import type { TypedContainer } from '@inversifyjs/strongly-typed';

describe('Bootstrapper', () => {
  const tempDirectories: string[] = [];

  const createConfigFile = (config: Record<string, unknown>) => {
    const directory = mkdtempSync(join(cwd(), 'bootstrapper-test-'));
    const filePath = join(directory, 'config.json');
    writeFileSync(filePath, JSON.stringify(config), 'utf-8');
    tempDirectories.push(directory);

    return relative(cwd(), filePath);
  };

  afterEach(() => {
    tempDirectories.splice(0).forEach((dir) => {
      rmSync(dir, { recursive: true, force: true });
    });
  });

  it('resolves namespaced config values after validation and runs init steps in order', async () => {
    const configPath = createConfigFile({
      foo: {
        bar: 'baz',
        count: 5,
      },
      other: {
        value: 'qux',
      },
    });

    const logger = mock<ILogger>();
    const decorator = mock<IDecoratorManager>();
    const container = mock<TypedContainer>();
    const bootstrapper = new Bootstrapper(
      configPath,
      logger,
      decorator,
      container
    );

    const order: string[] = [];
    const barValue = bootstrapper.configValue({
      namespace: 'foo',
      key: 'bar',
      schema: z.string(),
      description: 'bar value',
    });

    const countValue = bootstrapper.configValue({
      namespace: 'foo',
      key: 'count',
      schema: z.number(),
      description: 'count value',
    });

    const otherValue = bootstrapper.configValue({
      namespace: 'other',
      key: 'value',
      schema: z.string(),
      description: 'other value',
    });

    bootstrapper.onInit(async () => {
      order.push('first');
    });
    bootstrapper.onInit(async () => {
      order.push('second');
    });

    await bootstrapper.start();

    expect(await barValue.value).toBe('baz');
    expect(await countValue.value).toBe(5);
    expect(await otherValue.value).toBe('qux');
    expect(order).toEqual(['first', 'second']);
    expect(bootstrapper).toHaveProperty('configDescriptions', {
      foo: {
        bar: 'bar value',
        count: 'count value',
      },
      other: {
        value: 'other value',
      },
    });
  });

  it('logs validation errors and does not resolve values or run init steps when config is invalid', async () => {
    const configPath = createConfigFile({});
    const logger = mock<ILogger>();
    const decorator = mock<IDecoratorManager>();
    const container = mock<TypedContainer>();
    const bootstrapper = new Bootstrapper(
      configPath,
      logger,
      decorator,
      container
    );

    const pendingValue = bootstrapper.configValue({
      namespace: 'foo',
      key: 'bar',
      schema: z.string(),
      description: 'missing value',
    }).value;
    bootstrapper.configValue({
      namespace: 'foo',
      key: 'baz',
      schema: z.number(),
      description: 'missing number',
    });
    let resolved = false;
    pendingValue.then(() => {
      resolved = true;
    });

    const initStep = vi.fn(async () => {
      resolved = true;
    });
    bootstrapper.onInit(initStep);

    await bootstrapper.start();

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Missing config value: foo.bar (missing value)'),
      { context: 'bootstrapper' }
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Missing config value: foo.baz (missing number)'),
      { context: 'bootstrapper' }
    );

    expect(initStep).not.toHaveBeenCalled();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(resolved).toBe(false);
  });

  it('falls back to environment variables when config file values are missing', async () => {
    const originalEnv = process.env['ZERO_CONFIG_FOO_BAR'];
    process.env['ZERO_CONFIG_FOO_BAR'] = 'env-value';

    const configPath = createConfigFile({});
    const logger = mock<ILogger>();
    const decorator = mock<IDecoratorManager>();
    const container = mock<TypedContainer>();
    const bootstrapper = new Bootstrapper(
      configPath,
      logger,
      decorator,
      container
    );

    const value = bootstrapper.configValue({
      namespace: 'foo',
      key: 'bar',
      schema: z.string(),
      description: 'from env',
    });

    const initStep = vi.fn();
    bootstrapper.onInit(initStep);

    try {
      await bootstrapper.start();
    } finally {
      process.env['ZERO_CONFIG_FOO_BAR'] = originalEnv;
    }

    expect(await value.value).toBe('env-value');
    expect(initStep).toHaveBeenCalled();
  });

  it('includes non-missing validation issues in the log output', async () => {
    const configPath = createConfigFile({
      foo: {
        bar: 'hi',
      },
    });
    const logger = mock<ILogger>();
    const decorator = mock<IDecoratorManager>();
    const container = mock<TypedContainer>();
    const bootstrapper = new Bootstrapper(
      configPath,
      logger,
      decorator,
      container
    );

    bootstrapper.configValue({
      namespace: 'foo',
      key: 'bar',
      schema: z.string().min(5),
      description: 'bar value',
    });

    await bootstrapper.start();

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('foo.bar:'),
      { context: 'bootstrapper' }
    );
  });

  it('does not throw or log a validation error when an optional config value is missing', async () => {
    const configPath = createConfigFile({
      foo: {},
    });

    const logger = mock<ILogger>();
    const decorator = mock<IDecoratorManager>();
    const container = mock<TypedContainer>();
    const bootstrapper = new Bootstrapper(
      configPath,
      logger,
      decorator,
      container
    );

    const optionalValue = bootstrapper.configValue({
      namespace: 'foo',
      key: 'maybe',
      schema: z.string(),
      description: 'optional string',
      optional: true,
    });

    const initStep = vi.fn(async () => {
      //NOOP
    });
    bootstrapper.onInit(initStep);

    await bootstrapper.start();

    expect(await optionalValue.value).toBeUndefined();
    expect(logger.error).not.toHaveBeenCalled();
    expect(initStep).toHaveBeenCalled();
  });

  it('still validates an optional config value when it is present (and logs errors if invalid)', async () => {
    const configPath = createConfigFile({
      foo: {
        maybe: 'no', // too short
      },
    });

    const logger = mock<ILogger>();
    const decorator = mock<IDecoratorManager>();
    const container = mock<TypedContainer>();
    const bootstrapper = new Bootstrapper(
      configPath,
      logger,
      decorator,
      container
    );

    const optionalValuePromise = bootstrapper.configValue({
      namespace: 'foo',
      key: 'maybe',
      schema: z.string().min(5),
      description: 'optional string with min length',
      optional: true,
    }).value;

    let resolved = false;
    optionalValuePromise.then(() => {
      resolved = true;
    });

    const initStep = vi.fn(async () => {
      //NOOP
    });
    bootstrapper.onInit(initStep);

    await bootstrapper.start();

    // Should behave like normal validation: log error + do not run init hooks + do not resolve values
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('foo.maybe:'),
      { context: 'bootstrapper' }
    );
    expect(initStep).not.toHaveBeenCalled();

    await new Promise((r) => setTimeout(r, 0));
    expect(resolved).toBe(false);
  });

  it('uses env var for an optional value when present, otherwise resolves to undefined', async () => {
    const originalEnv = process.env['ZERO_CONFIG_FOO_OPT'];
    process.env['ZERO_CONFIG_FOO_OPT'] = 'from-env';

    const configPath = createConfigFile({
      foo: {},
    });

    const logger = mock<ILogger>();
    const decorator = mock<IDecoratorManager>();
    const container = mock<TypedContainer>();
    const bootstrapper = new Bootstrapper(
      configPath,
      logger,
      decorator,
      container
    );

    const optionalFromEnv = bootstrapper.configValue({
      namespace: 'foo',
      key: 'opt',
      schema: z.string(),
      description: 'optional from env',
      optional: true,
    });

    try {
      await bootstrapper.start();
    } finally {
      process.env['ZERO_CONFIG_FOO_OPT'] = originalEnv;
    }

    expect(await optionalFromEnv.value).toBe('from-env');
  });

  it('does not block startup when required values are present but optional values are missing', async () => {
    const configPath = createConfigFile({
      foo: {
        required: 'ok',
      },
    });

    const logger = mock<ILogger>();
    const decorator = mock<IDecoratorManager>();
    const container = mock<TypedContainer>();
    const bootstrapper = new Bootstrapper(
      configPath,
      logger,
      decorator,
      container
    );

    const requiredValue = bootstrapper.configValue({
      namespace: 'foo',
      key: 'required',
      schema: z.string(),
      description: 'required value',
    });

    const optionalValue = bootstrapper.configValue({
      namespace: 'foo',
      key: 'optional',
      schema: z.string(),
      description: 'optional value',
      optional: true,
    });

    const initStep = vi.fn(async () => {
      // NOOP
    });
    bootstrapper.onInit(initStep);

    await bootstrapper.start();

    expect(await requiredValue.value).toBe('ok');
    expect(await optionalValue.value).toBeUndefined();
    expect(initStep).toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });
});
