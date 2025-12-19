import { mock } from 'vitest-mock-extended';
import { CreateUserCommandHandler } from './create-user-command-handler.ts';
import {
  type IPasswordHasher,
  type IRoleRepository,
  type IUserRepository,
} from '@ports';
import { type ILogger } from '@zero/bootstrap';
import { getMockCommandContext } from '@test-helpers';
import { USER_ROLE_ID } from '@constants';
import { when } from 'vitest-when';
import { type IRole, type Role, User } from '@zero/domain';

vi.mock('@zero/domain');

afterEach(() => {
  vi.resetAllMocks();
});

const getHandler = () => {
  const userRepo = mock<IUserRepository>();
  const logger = mock<ILogger>();
  const roleRepo = mock<IRoleRepository>();
  const passwordHasher = mock<IPasswordHasher>();

  const handler = new CreateUserCommandHandler(
    userRepo,
    roleRepo,
    passwordHasher,
    logger
  );

  return { handler, userRepo, roleRepo, passwordHasher, logger };
};

describe('create user command handler', () => {
  it('calls create on the user and then passes into the repo', async () => {
    const { handler, roleRepo, userRepo, passwordHasher } = getHandler();

    const context = getMockCommandContext('CreateUserCommand', {
      username: 'ben',
      email: 'a@b.c',
      password: 'pass',
    });

    const mockObjectRole = mock<IRole>();

    const mockRole = mock<Role>({
      toObject: () => mockObjectRole,
    });

    const mockUser = mock<User>();

    when(User.create)
      .calledWith({
        id: 'ben',
        email: 'a@b.c',
        passwordHash: 'hash',
        roles: [mockObjectRole],
      })
      .thenReturn(mockUser);

    when(roleRepo.get).calledWith(USER_ROLE_ID).thenResolve(mockRole);
    when(passwordHasher.hashPassword).calledWith('pass').thenResolve('hash');

    await handler.doHandle(context);

    expect(userRepo.save).toHaveBeenCalledWith(mockUser);
  });
});
