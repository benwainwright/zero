import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { inject } from '@core';

import type { IObjectStorage } from '@zero/application-core';
import { type ConfigValue, type ILogger } from '@zero/bootstrap';
import { injectable, type ServiceIdentifier } from 'inversify';

export const LOG_CONTEXT = { context: 'flat-file-object-store' };

export const FlatFileObjectStoreFolderToken: ServiceIdentifier<
  ConfigValue<string>
> = Symbol.for('FlatFileObjectStoreFolderToken');

@injectable()
export class FlatFileObjectStore implements IObjectStorage {
  public constructor(
    @inject('StoragePath')
    private folder: ConfigValue<string>,

    @inject('Logger')
    private logger: ILogger
  ) {}

  public async listKeys(namespace: string): Promise<string[]> {
    const path = await this.resolvePath(namespace);
    this.logger.silly(`Path resolved at ${path}`, LOG_CONTEXT);
    try {
      return await readdir(path);
    } catch {
      return [];
    }
  }

  private async resolvePath(namespace: string, key?: string) {
    const base = await this.folder.value;
    if (key) {
      return join(cwd(), base, namespace, key);
    }
    return join(cwd(), base, namespace);
  }

  public async get(
    namespace: string,
    key: string
  ): Promise<string | undefined> {
    const path = await this.resolvePath(namespace, key);
    this.logger.silly(`Path resolved at ${path}`, LOG_CONTEXT);

    try {
      return await readFile(path, 'utf8');
    } catch {
      return undefined;
    }
  }

  public async clear(namespace: string) {
    const path = await this.resolvePath(namespace);
    const dir = path.substring(0, path.lastIndexOf('/'));
    await rm(dir, { force: true, recursive: true });
  }

  public async set(
    namespace: string,
    key: string,
    thing: string | undefined
  ): Promise<void> {
    const path = await this.resolvePath(namespace, key);
    const dir = path.substring(0, path.lastIndexOf('/'));

    await mkdir(dir, { recursive: true });

    this.logger.silly(`Storing ${String(thing)} in ${path}`, LOG_CONTEXT);

    if (typeof thing === 'undefined') {
      await rm(path, { force: true });
    } else {
      await writeFile(path, thing);
    }
  }
}
