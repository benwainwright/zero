import { getServerWithDepsMocked } from './get-server-with-deps-mocked.ts';
import { getClientWithDepsMocked } from './get-client-with-deps-mocked.ts';
import { v5, v7 } from 'uuid';
import { when } from 'vitest-when';

vi.mock('uuid');

afterEach(() => {
  vi.resetAllMocks();
});

describe('the command client', () => {
  it('correctly forwards commands to the command bus', async () => {
    const { server, port, commandBus } = await getServerWithDepsMocked();

    const { commandClient, uuidGenerator } = await getClientWithDepsMocked(
      port
    );
    uuidGenerator.v7.mockReturnValue('foo-id');

    await server.start();

    await commandClient.execute({
      key: 'CreateUserCommand',
      params: {
        email: 'a@b.c',
        password: 'foo',
        username: 'foo',
      },
    });

    await vi.waitFor(() => {
      expect(commandBus.execute).toHaveBeenCalledWith({
        key: 'CreateUserCommand',
        params: {
          email: 'a@b.c',
          password: 'foo',
          username: 'foo',
        },
        id: 'foo-id',
      });
    });

    server.close();
  });
});
