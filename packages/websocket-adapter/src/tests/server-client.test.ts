import { getServerWithDepsMocked } from './get-server-with-deps-mocked.ts';
import { getClientWithDepsMocked } from './get-client-with-deps-mocked.ts';
import { AbstractError } from '@zero/bootstrap';
import type { IEventEmitter } from '@zero/application-core';

vi.mock('uuid');

afterEach(() => {
  vi.resetAllMocks();
});

describe('the app server', () => {
  it('logs weird error', async () => {
    const { server, port, serviceBus, logger } =
      await getServerWithDepsMocked();

    await server.start();

    const { serviceClient, uuidGenerator, socket } =
      await getClientWithDepsMocked(port);

    uuidGenerator.v7.mockReturnValue('foo-id');

    serviceBus.execute.mockRejectedValue('foo');

    await serviceClient.execute('CreateUserCommand', {
      email: 'a@b.c',
      password: 'foo',
      username: 'foo',
    });

    await vi.waitFor(() => {
      expect(logger.error).toHaveBeenCalled();
    });

    server.close();
    socket.close();
  });

  it('logs error', async () => {
    const { server, port, serviceBus, logger } =
      await getServerWithDepsMocked();

    await server.start();

    const { serviceClient, uuidGenerator, socket } =
      await getClientWithDepsMocked(port);

    uuidGenerator.v7.mockReturnValue('foo-id');

    serviceBus.execute.mockRejectedValue(new Error('foo'));

    await serviceClient.execute('CreateUserCommand', {
      email: 'a@b.c',
      password: 'foo',
      username: 'foo',
    });

    await vi.waitFor(() => {
      expect(logger.error).toHaveBeenCalled();
    });

    server.close();
    socket.close();
  });

  it('calls handle for any error descended from abstract error', async () => {
    const { server, port, serviceBus, eventBus } =
      await getServerWithDepsMocked();

    await server.start();

    const { serviceClient, uuidGenerator, socket } =
      await getClientWithDepsMocked(port);

    uuidGenerator.v7.mockReturnValue('foo-id');

    const handleMock = vi.fn();

    class TestError extends AbstractError {
      public override handle(events: IEventEmitter): void {
        handleMock(events);
      }
    }

    serviceBus.execute.mockRejectedValue(new TestError('foo'));

    await serviceClient.execute('CreateUserCommand', {
      email: 'a@b.c',
      password: 'foo',
      username: 'foo',
    });

    await vi.waitFor(() => {
      expect(handleMock).toHaveBeenCalledWith(eventBus);
    });

    server.close();
    socket.close();
  });

  it('removes all event handlers on close', async () => {
    const { server, eventBus, port } = await getServerWithDepsMocked();

    await server.start();
    await getClientWithDepsMocked(port);

    server.close();

    await vi.waitFor(() => {
      expect(eventBus.removeAll).toHaveBeenCalled();
    });
  });
});

describe('the command client', () => {
  it('correctly forwards commands to the command bus', async () => {
    const { server, port, serviceBus } = await getServerWithDepsMocked();

    await server.start();

    const { serviceClient, uuidGenerator, socket } =
      await getClientWithDepsMocked(port);

    uuidGenerator.v7.mockReturnValue('foo-id');

    await serviceClient.execute('CreateUserCommand', {
      email: 'a@b.c',
      password: 'foo',
      username: 'foo',
    });

    await vi.waitFor(() => {
      expect(serviceBus.execute).toHaveBeenCalledWith({
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
    socket.close();
  });
});
