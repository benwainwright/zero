import { type IAuthTypes } from '@zero/auth';
import { module } from '@zero/bootstrap';
import { NodePasswordHasher } from '@adapters';

export const nodeAdaptersModule = module<IAuthTypes>(({ load }) => {
  load.bind('PasswordHasher').to(NodePasswordHasher);
});
