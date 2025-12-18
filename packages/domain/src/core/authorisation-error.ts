import { DomainError } from './domain-error.ts';
import type { DomainModel } from './domain-model.ts';
import type { ICapability } from './i-capability.ts';

export class AuthorisationError extends DomainError {
  public constructor(
    public readonly entity: DomainModel<unknown>,
    public readonly neededCapabilities: ICapability
  ) {
    super();
  }
}
