import type { ContainerWithMove } from './container-with-move.ts';
import type { BindingMap } from './inversify-types.ts';
import { Plugin, type PluginApi } from '@inversifyjs/plugin';

export class MovePlugin<TMap extends BindingMap> extends Plugin<
  ContainerWithMove<TMap>
> {
  override load(api: PluginApi): void {
    api.define('moveBinding', async (from: string, to: string) => {
      await this.moveBinding(from, to);
    });
  }

  private async moveBinding(from: string, to: string) {
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

    await this._container.unbind(from);
  }
}
