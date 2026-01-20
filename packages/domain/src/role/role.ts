import type { IPermission } from '@permission';
import { DomainModel } from '@core';

import { roleSchema, type IRole } from './i-role.ts';
import type { IRoute } from './i-route.ts';

export class Role extends DomainModel<IRole> {
  public static key = 'role';
  public override readonly id: string;
  private _name: string;
  private _permissions: IPermission[];
  private _routes: IRoute[];

  public static reconstitute(config: IRole) {
    return new Role(roleSchema.parse(config));
  }

  private constructor(config: IRole) {
    super();
    this.id = config.id;
    this._name = config.name;
    this._permissions = config.permissions;
    this._routes = config.routes;
  }

  public get permissions() {
    return this._permissions;
  }

  public get routes() {
    return this._routes;
  }

  public get name() {
    return this._name;
  }

  public update(config: Partial<IRole>) {
    const old = Role.reconstitute(this);
    this._name = config.name ?? this._name;
    this._permissions = config.permissions ?? this._permissions;
    this._routes = config.routes ?? this._routes;
    this.raiseEvent({
      event: 'RoleUpdated',
      data: { old, new: Role.reconstitute(this) },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public override toObject(_config?: { secure: boolean }): {
    id: string;
    name: string;
    permissions: IPermission[];
    routes: IRoute[];
  } {
    return {
      routes: this.routes,
      id: this.id,
      name: this._name,
      permissions: this._permissions,
    };
  }
}
