import { Container, type ServiceIdentifier } from 'inversify';
import { Plugin, type PluginApi } from '@inversifyjs/plugin';
import { mock } from 'vitest-mock-extended';
import { getConstructorArguments } from './get-constructor-arguments.ts';

export class StubPlugin extends Plugin<Container> {
  private getArgsForBoundThing(token: ServiceIdentifier<unknown>) {
    const bindings = this._context.bindingService.get(token);
    if (!bindings) {
      return undefined;
    }

    if (Array.from(bindings).length !== 1) {
      return undefined;
    }

    const [binding] = bindings;

    if (binding?.type !== 'Instance') {
      return undefined;
    }

    return getConstructorArguments(binding.implementationType);
  }

  private mockUnbound(token: ServiceIdentifier<unknown>) {
    const args = this.getArgsForBoundThing(token);
    if (args) {
      args.forEach((arg) =>
        this._container.isBound(arg.value)
          ? this.mockUnbound(arg.value)
          : this._container.bind(arg.value).toConstantValue(mock())
      );
    }
  }

  override load(api: PluginApi): void {
    const get = this._container.get.bind(this._container);
    const getAsync = this._container.getAsync.bind(this._container);

    api.define('getAsync', async (token: ServiceIdentifier<unknown>) => {
      try {
        this.mockUnbound(token);
        return await getAsync(token);
      } catch {
        this._container.bind(token).toConstantValue(mock());
        return await getAsync(token);
      }
    });

    api.define('get', (token: ServiceIdentifier<unknown>) => {
      try {
        this.mockUnbound(token);
        return get(token);
      } catch {
        this._container.bind(token).toConstantValue(mock());
        return get(token);
      }
    });
  }
}
