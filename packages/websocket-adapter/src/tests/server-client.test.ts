import { getServerWithDepsMocked } from './get-server-with-deps-mocked.ts';
import { getClientWithDepsMocked } from './get-client-with-deps-mocked.ts';
import { when } from 'vitest-when';
import { AbstractError } from '@zero/bootstrap';
import type { IEventEmitter } from '@zero/application-core';

vi.mock('uuid');

afterEach(() => {
  vi.resetAllMocks();
});

describe('the app server', () => {
  it('logs weird error', async () => {
    const { server, port, commandBus, logger } =
      await getServerWithDepsMocked();

    await server.start();

    const { commandClient, uuidGenerator, socket } =
      await getClientWithDepsMocked(port);

    uuidGenerator.v7.mockReturnValue('foo-id');

    commandBus.execute.mockRejectedValue('foo');

    await commandClient.execute('CreateUserCommand', {
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
    const { server, port, commandBus, logger } =
      await getServerWithDepsMocked();

    await server.start();

    const { commandClient, uuidGenerator, socket } =
      await getClientWithDepsMocked(port);

    uuidGenerator.v7.mockReturnValue('foo-id');

    commandBus.execute.mockRejectedValue(new Error('foo'));

    await commandClient.execute('CreateUserCommand', {
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
    const { server, port, commandBus, eventBus } =
      await getServerWithDepsMocked();

    await server.start();

    const { commandClient, uuidGenerator, socket } =
      await getClientWithDepsMocked(port);

    uuidGenerator.v7.mockReturnValue('foo-id');

    const handleMock = vi.fn();

    class TestError extends AbstractError {
      public override handle(events: IEventEmitter): void {
        handleMock(events);
      }
    }

    commandBus.execute.mockRejectedValue(new TestError('foo'));

    await commandClient.execute('CreateUserCommand', {
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

describe('the query client', () => {
  it('results in queries being executed and returned', async () => {
    const { server, port, queryBus } = await getServerWithDepsMocked();

    await server.start();

    const { queryClient, uuidGenerator, socket } =
      await getClientWithDepsMocked(port);

    uuidGenerator.v7.mockReturnValue('foo-id');

    const expectedResult = {
      foo: 'bar',
    };

    when(queryBus.execute)
      .calledWith({
        id: 'foo-id',
        key: 'GetCurrentUser',
        params: undefined,
      })
      .thenResolve(expectedResult);

    const response = await queryClient.execute('GetCurrentUser');

    expect(response).toEqual(expectedResult);

    socket.close();
    server.close();
  });

  it('routes the responses correctly', async () => {
    const { server, port, queryBus } = await getServerWithDepsMocked();

    await server.start();

    const { queryClient, uuidGenerator, socket } =
      await getClientWithDepsMocked(port);

    uuidGenerator.v7
      .mockReturnValueOnce('foo-id-one')
      .mockReturnValueOnce('foo-id-two');

    const expectedResultOne = {
      foo: 'bar',
    };

    const expectedResultTwo = {
      foo: 'bip',
    };

    when(queryBus.execute)
      .calledWith({
        id: 'foo-id-one',
        key: 'GetCurrentUser',
        params: undefined,
      })
      .thenResolve(expectedResultOne);

    when(queryBus.execute)
      .calledWith({
        id: 'foo-id-two',
        key: 'GetCurrentUser',
        params: undefined,
      })
      .thenResolve(expectedResultTwo);

    const responseOnePromise = queryClient.execute('GetCurrentUser');

    const responseTwoPromise = queryClient.execute('GetCurrentUser');

    expect(await responseOnePromise).toEqual(expectedResultOne);
    expect(await responseTwoPromise).toEqual(expectedResultTwo);

    socket.close();
    server.close();
  });
});

describe('the command client', () => {
  it('correctly forwards commands to the command bus', async () => {
    const { server, port, commandBus } = await getServerWithDepsMocked();

    await server.start();

    const { commandClient, uuidGenerator, socket } =
      await getClientWithDepsMocked(port);

    uuidGenerator.v7.mockReturnValue('foo-id');

    await commandClient.execute('CreateUserCommand', {
      email: 'a@b.c',
      password: 'foo',
      username: 'foo',
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
    socket.close();
  });
});
