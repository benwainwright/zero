import type { LiteralUnion } from 'type-fest';

export interface StackFrame {
  file: string | null;
  methodName: LiteralUnion<'<unknown>', string>;
  arguments: string[];
  lineNumber: number | null;
  column: number | null;
}

export interface IErrorEvents {
  ApplicationError: {
    parsedStack: StackFrame[];
    message: string | undefined;
    cause?:
      | {
          message: string | undefined;
          stack: StackFrame[];
        }
      | undefined;
  };
}
