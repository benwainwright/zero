import type { IPermission } from '@permission';
import { DomainModel } from '@core';

import type { IRole } from './i-role.ts';
import type { IRoute } from './i-route.ts';

export class Role extends DomainModel<IRole> {
  public override readonly id: string;

  private readonly _name: string;
  private readonly _permissions: IPermission[];
  private readonly _routes: ReadonlyArray<IRoute>;

  public static reconstitute(config: IRole) {
    return new Role(config);
  }

  public constructor(config: IRole) {
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

  public override toObject(_config?: { secure: boolean }): {
    id: string;
    name: string;
    permissions: IPermission[];
    routes: readonly IRoute[];
  } {
    return {
      routes: this.routes,
      id: this.id,
      name: this._name,
      permissions: this._permissions,
    };
  }
}
