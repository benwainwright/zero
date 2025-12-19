import { DomainModel, type ICapability } from '@zero/domain';
import { AuthError } from './auth-error.ts';

export class AuthorisationError extends AuthError {
  public constructor(
    public readonly entity: DomainModel<unknown>,
    public readonly neededCapabilities: ICapability
  ) {
    super(
      `Not authorised - need ${neededCapabilities} for resource ${entity.id}`
    );
  }
}
