import type { LiteralUnion } from 'type-fest';
import { Notification } from '@mantine/core';
import { StackTrace } from '@components';
interface NotificationProps {
  message: string;
  stack: StackFrame[];
}

export interface StackFrame {
  file: string | null;
  methodName: LiteralUnion<'<unknown>', string>;
  arguments: string[];
  lineNumber: number | null;
  column: number | null;
}

export const ErrorNotification = ({ message, stack }: NotificationProps) => {
  return (
    <Notification title="Error" color="red">
      {message}
      <StackTrace trace={stack} />
    </Notification>
  );
};
