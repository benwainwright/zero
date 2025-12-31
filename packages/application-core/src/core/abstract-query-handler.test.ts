import type { IQueryContext } from '@types';
import { AbstractQueryHandler } from './abstract-query-handler.ts';
import type { ILogger } from '@zero/bootstrap';
import { mock } from 'vitest-mock-extended';

describe('abstract query handler', () => {
  describe('try handle', () => {
    it('returns true and the result from the handler if the handler can handle the query', async () => {
      type TestQueries =
        | {
            id: string;
            key: 'TestQuery';
            params: {
              foo: string;
            };
            response: {
              foo: string;
            };
          }
        | {
            id: string;
            key: 'OtherTestQuery';
            response: {
              bar: string;
            };
          };

      const handledMock = vi.fn();

      class TestHandler extends AbstractQueryHandler<TestQueries, 'TestQuery'> {
        protected override async handle(
          context: IQueryContext<never>
        ): Promise<{ foo: string }> {
          handledMock(context);
          return { foo: 'bar' };
        }

        public override readonly name = 'TestQuery';
      }

      const logger = mock<ILogger>();

      const handler = new TestHandler(logger);

      const result = await handler.tryHandle({
        query: {
          key: 'TestQuery',
          id: 'foo-bar',
          params: {
            foo: 'hello',
          },
        },
        authContext: undefined,
      });

      expect(result.handled).toEqual(true);
      if (result.handled === true) {
        expect(result.response).toEqual({ foo: 'bar' });
        expect(handledMock).toHaveBeenCalledWith({
          authContext: undefined,
          query: { foo: 'hello' },
          id: 'foo-bar',
        });
      }
    });

    it('returns false if the handler cannot handle the query', async () => {
      type TestQueries =
        | {
            id: string;
            key: 'TestQuery';
            response: {
              foo: string;
            };
          }
        | {
            id: string;
            key: 'OtherTestQuery';
            response: {
              bar: string;
            };
          };

      const handledMock = vi.fn();

      class TestHandler extends AbstractQueryHandler<TestQueries, 'TestQuery'> {
        protected override async handle(
          context: IQueryContext<never>
        ): Promise<{ foo: string }> {
          handledMock(context);
          return { foo: 'bar' };
        }

        public override readonly name = 'TestQuery';
      }

      const logger = mock<ILogger>();

      const handler = new TestHandler(logger);

      const result = await handler.tryHandle({
        query: {
          key: 'OtherTestQuery',
          id: 'foo-bar',
          params: {
            bar: 'thing',
          },
        },
        authContext: undefined,
      });

      expect(result.handled).toEqual(false);
      expect(handledMock).not.toHaveBeenCalled();
    });
  });
});
