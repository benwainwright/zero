import type { ICommandContext } from '@types';
import { AbstractCommandHandler } from './abstract-command-handler.ts';
import { mock } from 'vitest-mock-extended';
import type { ILogger } from '@zero/bootstrap';
import type { IEventBus } from '@ports';

describe('abstract command handler', () => {
  describe('tryHandle', () => {
    it('returns false if the key doesnt match', async () => {
      type TestCommands =
        | {
            id: string;
            key: 'TestCommand';
            params: {
              hello: string;
            };
          }
        | {
            id: string;
            key: 'TestOtherCommand';
          };

      const handledMock = vi.fn();

      class TestHandler extends AbstractCommandHandler<
        TestCommands,
        'TestCommand'
      > {
        protected override async handle(
          context: ICommandContext<{
            id: string;
            key: 'TestCommand';
            params: {
              hello: string;
            };
          }>
        ): Promise<void> {
          handledMock(context);
        }

        public override readonly name = 'TestCommand';
      }

      const logger = mock<ILogger>();
      const handler = new TestHandler(logger);

      const events = mock<IEventBus>();

      const result = await handler.tryHandle({
        events,
        command: {
          id: 'foo-bar',
          key: 'TestOtherCommand',
          params: {
            foo: 'bar',
          },
        },
        authContext: undefined,
      });

      expect(result).toEqual(false);
      expect(handledMock).not.toHaveBeenCalled();
    });
    it('returns true and calls handle if canHandle returned true', async () => {
      type TestCommands =
        | {
            id: string;
            key: 'TestCommand';
            params: {
              hello: string;
            };
          }
        | {
            id: string;
            key: 'TestOtherCommand';
          };

      const handledMock = vi.fn();

      class TestHandler extends AbstractCommandHandler<
        TestCommands,
        'TestCommand'
      > {
        protected override async handle(
          context: ICommandContext<{
            id: string;
            key: 'TestCommand';
            params: {
              hello: string;
            };
          }>
        ): Promise<void> {
          handledMock(context);
        }

        public override readonly name = 'TestCommand';
      }

      const logger = mock<ILogger>();
      const handler = new TestHandler(logger);
      const events = mock<IEventBus>();

      const result = await handler.tryHandle({
        events,
        command: {
          id: 'foo-bar',
          key: 'TestCommand',
          params: {
            foo: 'bar',
          },
        },
        authContext: undefined,
      });

      expect(result).toEqual(true);
      expect(handledMock).toHaveBeenCalledWith({
        authContext: undefined,
        command: { foo: 'bar' },
        id: 'foo-bar',
      });
    });
  });
});
