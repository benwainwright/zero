import type { LiteralUnion } from 'type-fest';
import * as stackTraceParser from 'stacktrace-parser';

export interface StackFrame {
  file: string | null;
  methodName: LiteralUnion<'<unknown>', string>;
  arguments: string[];
  lineNumber: number | null;
  column: number | null;
}

interface IEventEmitter {
  emit(key: unknown, data: unknown): void;
}

export abstract class AbstractError extends Error {
  public parsedStack: StackFrame[];

  public parsedCause:
    | {
        message: string;
        stack: StackFrame[];
      }
    | undefined;

  public constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.parsedStack = stackTraceParser.parse(this.stack ?? '');
    if (
      cause &&
      typeof cause === 'object' &&
      'stack' in cause &&
      typeof cause.stack === 'string'
    ) {
      this.parsedCause = {
        message:
          'message' in cause && typeof cause.message === 'string'
            ? cause.message
            : '',
        stack: stackTraceParser.parse(cause.stack ?? ''),
      };
    }
  }

  public abstract handle(events: IEventEmitter): void;
}
