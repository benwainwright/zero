import type { IActor } from '@zero/domain';

export abstract class BaseHandler {
  private _authContext: IActor | undefined;

  public setAuthContext(context: IActor) {
    this._authContext = context;
  }

  protected get authContext() {
    return this._authContext;
  }
}
