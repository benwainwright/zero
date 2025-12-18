import type { IPermission } from '@permission';
import { DomainModel } from '@core';

import type { IRole } from './i-role.ts';

export class Role extends DomainModel<IRole> {
  public override readonly id: string;

  private readonly _name: string;
  private readonly _permissions: IPermission[];

  public static reconstitute(config: IRole) {
    return new Role(config);
  }

  public constructor(config: IRole) {
    super();
    this.id = config.id;
    this._name = config.name;
    this._permissions = config.permissions;
  }

  public override toObject(_config?: { secure: boolean }): {
    id: string;
    name: string;
    permissions: IPermission[];
  } {
    return {
      id: this.id,
      name: this._name,
      permissions: this._permissions,
    };
  }
}
