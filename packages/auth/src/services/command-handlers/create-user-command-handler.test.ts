import { mock } from 'vitest-mock-extended';
import { CreateUserCommandHandler } from './create-user-command-handler.ts';
import { USER_ROLE_ID } from '@constants';
import { when } from 'vitest-when';
import { type IRole, type Role, User } from '@zero/domain';
import { buildRequestHandler } from '@zero/test-helpers';

vi.mock('@zero/domain');

afterEach(() => {
  vi.resetAllMocks();
});

describe('create user command handler', () => {
  it('calls create on the user and then passes into the repo', async () => {
    const {
      handler,
      context,
      dependencies: [writer, roleRepo, passwordHasher],
    } = await buildRequestHandler(
      CreateUserCommandHandler,
      'CreateUserCommand',
      {
        username: 'ben',
        email: 'a@b.c',
        password: 'pass',
      }
    );

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

    when(roleRepo.require).calledWith(USER_ROLE_ID).thenResolve(mockRole);
    when(passwordHasher.hashPassword).calledWith('pass').thenResolve('hash');

    await handler.tryHandle(context);

    expect(writer.save).toHaveBeenCalledWith(mockUser);
  });
});
