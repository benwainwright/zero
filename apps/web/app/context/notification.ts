import type { LiteralUnion } from 'type-fest';

interface NormalNotificaion {
  type: 'failure' | 'success' | 'info';
  message: string;
}

interface ErrorNotification {
  type: 'error';
  message: string;
  stack: StackFrame[];
}

export type NotificationData = ErrorNotification | NormalNotificaion;

export interface StackFrame {
  file: string | null;
  methodName: LiteralUnion<'<unknown>', string>;
  arguments: string[];
  lineNumber: number | null;
  column: number | null;
}
