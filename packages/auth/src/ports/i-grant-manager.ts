import type { DomainModel, IActor, ICapability } from '@zero/domain';

export interface IGrantManager {
  setActor(actor: IActor): void;

  done(): void;

  requiresNoPermissions(): void;

  requires(config: {
    capability: ICapability;
    for?: DomainModel<unknown> | unknown;
  }): void;
}
