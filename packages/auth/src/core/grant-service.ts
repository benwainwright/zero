import type { DomainModel, IActor, ICapability } from '@zero/domain';
import { AuthorisationError } from './authorisation-error.ts';
import { injectable } from 'inversify';
import { AuthError } from './auth-error.ts';

@injectable()
export class GrantService {
  private permissionsSet = false;
  private actor: IActor | undefined;

  public setActor(actor: IActor) {
    this.actor = actor;
  }

  public done() {
    if (!this.permissionsSet) {
      throw new AuthError(`Error - no permissions set`);
    }
  }

  private isThereAMatchingPermission(
    entity: DomainModel<unknown> | undefined,
    capability: ICapability,
    action: 'ALLOW' | 'DENY'
  ) {
    const foundMatchingPerms = this.actor?.permissions.filter(
      (permission) =>
        permission.action === action &&
        (permission.capabilities.includes(capability) ||
          permission.capabilities.includes('all'))
    );

    return foundMatchingPerms?.find((allow) => {
      if (allow.resource === '*') {
        return true;
      }

      return Boolean(entity && allow.resource.id === entity?.id);
    });
  }

  public requiresNoPermissions() {
    this.permissionsSet = true;
  }

  public requires(config: {
    capability: ICapability;
    for?: DomainModel<unknown>;
  }) {
    const allowPermissionFound = this.isThereAMatchingPermission(
      config.for,
      config.capability,
      'ALLOW'
    );

    const denyPermissionFound = this.isThereAMatchingPermission(
      config.for,
      config.capability,
      'DENY'
    );

    if (allowPermissionFound && !denyPermissionFound) {
      this.permissionsSet = true;
      return;
    }

    throw new AuthorisationError(config.for, config.capability);
  }
}
