import type { ContainerWithMove } from './container-with-move.ts';
import type { BindingMap } from './inversify-types.ts';
import { Plugin, type PluginApi } from '@inversifyjs/plugin';

type BindingScope = 'Singleton' | 'Transient' | 'Request';

export class MovePlugin<TMap extends BindingMap> extends Plugin<
  ContainerWithMove<TMap>
> {
  override load(api: PluginApi): void {
    api.define('moveBinding', (from: string, to: string) => {
      this.moveBinding(from, to);
    });
    api.define('getBindingScope', (token: string) => {
      this.getBindingScope(token);
    });
  }

  private getBindingScope(token: string) {
    const result = this._context.bindingService.get(token);
    let binding: { type: 'Instance'; scope: BindingScope } | undefined;

    if (result) {
      for (const thing of result) {
        if (thing.type === 'Instance') {
          binding = thing;
        }
      }
    }

    return binding?.scope;
  }

  private moveBinding(from: string, to: string) {
    const result = this._context.bindingService.get(from);

    if (result) {
      for (const thing of result) {
        if (thing.type === 'Instance') {
          this._context.bindingService.set({
            ...thing,
            serviceIdentifier: to,
          });
        }
      }
    }

    this._container.unbindSync(from);
  }
}
