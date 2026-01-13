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

  public constructor(message: string) {
    super(message);
    this.parsedStack = stackTraceParser.parse(this.stack ?? '');
  }

  public abstract handle(events: IEventEmitter): void;
}
