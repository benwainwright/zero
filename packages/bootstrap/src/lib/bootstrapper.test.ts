import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { cwd } from 'process';
import { Bootstrapper } from './bootstrapper.ts';
import z from 'zod';
import { mock } from 'vitest-mock-extended';
import type { ILogger } from '@types';

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
    const bootstrapper = new Bootstrapper(configPath, logger);

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

    bootstrapper.addInitStep(async () => {
      order.push('first');
    });
    bootstrapper.addInitStep(async () => {
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
    const bootstrapper = new Bootstrapper(configPath, logger);

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
    bootstrapper.addInitStep(initStep);

    await bootstrapper.start();

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Missing config value: foo.bar (missing value)'),
      { context: 'bootstrapper', error: expect.anything() }
    );
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Missing config value: foo.baz (missing number)'),
      { context: 'bootstrapper', error: expect.anything() }
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
    const bootstrapper = new Bootstrapper(configPath, logger);

    const value = bootstrapper.configValue({
      namespace: 'foo',
      key: 'bar',
      schema: z.string(),
      description: 'from env',
    });

    const initStep = vi.fn();
    bootstrapper.addInitStep(initStep);

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
    const bootstrapper = new Bootstrapper(configPath, logger);

    bootstrapper.configValue({
      namespace: 'foo',
      key: 'bar',
      schema: z.string().min(5),
      description: 'bar value',
    });

    await bootstrapper.start();

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('foo.bar:'),
      { context: 'bootstrapper', error: expect.anything() }
    );
  });
});
