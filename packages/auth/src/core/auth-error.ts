import { AppError } from '@zero/application-core';

export class AuthError extends AppError {
  public constructor(message: string) {
    super(message);
  }
}
