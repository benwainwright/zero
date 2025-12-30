import { Role, type IRoute } from '@role';
import { userSchema, type IUser } from './i-user.ts';
import { DomainModel, type IActor, type IViewer } from '@core';

export class User extends DomainModel<IUser> implements IActor, IViewer {
  public readonly id: string;
  private _passwordHash: string;
  private _email: string;
  private _roles: Role[];

  private constructor(config: IUser) {
    super();
    this.id = config.id;
    this._passwordHash = config.passwordHash;
    this._email = config.email;
    this._roles = config.roles.map((role) => Role.reconstitute(role));
  }

  public canView(route: IRoute): boolean {
    return Boolean(
      this._roles.find((role) =>
        Boolean(
          role.routes.find(
            (theRoute) => theRoute === route || theRoute === 'all'
          )
        )
      )
    );
  }

  public clone() {
    return User.reconstitute(this.toObject({ secure: true }));
  }

  public get permissions() {
    return this._roles.flatMap((role) => role.toObject().permissions);
  }

  public get roles() {
    return this._roles;
  }

  public static create(config: IUser) {
    const user = new User({ ...config });
    user.raiseEvent({ event: 'UserCreated', data: user });
    return user;
  }

  public override toObject(config?: { secure: boolean }): IUser {
    return {
      roles: this._roles.map((item) => item.toObject(config)),
      id: this.id,
      passwordHash: config?.secure ? this._passwordHash : ``,
      email: this._email,
    };
  }

  public delete() {
    this.raiseEvent({ event: 'UserDeleted', data: this });
  }

  public static reconstitute(data: IUser): User {
    return new User(userSchema.parse(data));
  }

  public get passwordHash() {
    return this._passwordHash;
  }

  public get email() {
    return this._email;
  }

  public update({ hash, email }: { hash?: string; email?: string }) {
    const old = this.clone();
    this._passwordHash = hash ?? this._passwordHash;
    this._email = email ?? this._email;
    this.raiseEvent({ event: 'UserUpdated', data: { old, new: this.clone() } });
  }
}
