import type { IPasswordHasher, IPasswordVerifier } from '@zero/auth';
import bcrypt from 'bcryptjs';
import { injectable } from 'inversify';

@injectable()
export class NodePasswordHasher implements IPasswordHasher, IPasswordVerifier {
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
  public async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
