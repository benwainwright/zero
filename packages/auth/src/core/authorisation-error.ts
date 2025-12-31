import { DomainModel, type ICapability } from '@zero/domain';
import { AuthError } from './auth-error.ts';

export class AuthorisationError extends AuthError {
  public constructor(
    public readonly entity: DomainModel<unknown> | undefined,
    public readonly neededCapabilities: ICapability
  ) {
    super(
      `Not authorised - ${neededCapabilities}${
        entity ? `for resource ${entity.id}}` : ``
      }  not permitted`
    );
  }
}
