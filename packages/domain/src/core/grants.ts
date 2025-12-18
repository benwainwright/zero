import type { IPermission } from '@permission';
import type { DomainModel } from './domain-model.ts';
import type { ICapability } from './i-capability.ts';
import { AuthorisationError } from './authorisation-error.ts';

export class Grants {
  public constructor(private readonly permissions: IPermission[]) {}

  public isThereAMatchingPermission(
    entity: DomainModel<unknown>,
    capability: ICapability,
    action: 'ALLOW' | 'DENY'
  ) {
    const foundMatchingPerms = this.permissions.filter(
      (permission) =>
        permission.action === action &&
        permission.capabilities.includes(capability)
    );

    return foundMatchingPerms.find(
      (allow) => allow.resource === '*' || allow.resource.id === entity.id
    );
  }

  public can(entity: DomainModel<unknown>, capability: ICapability) {
    const allowPermissionFound = this.isThereAMatchingPermission(
      entity,
      capability,
      'ALLOW'
    );

    const denyPermissionFound = this.isThereAMatchingPermission(
      entity,
      capability,
      'DENY'
    );

    if (allowPermissionFound && !denyPermissionFound) {
      return;
    }

    throw new AuthorisationError(entity, capability);
  }
}
