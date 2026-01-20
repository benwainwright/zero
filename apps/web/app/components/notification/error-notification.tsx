import type { LiteralUnion } from 'type-fest';
import { Notification } from '@mantine/core';
import { StackTrace } from '@components';
interface NotificationProps {
  error: ErrorDetails;
}

interface ErrorDetails {
  message: string | undefined;
  stack: {
    file: string | null;
    methodName: LiteralUnion<'<unknown>', string>;
    arguments: string[];
    lineNumber: number | null;
    column: number | null;
  }[];
  cause?: ErrorDetails | undefined;
}

export const ErrorNotification = ({ error }: NotificationProps) => {
  return (
    <Notification title="Error" color="red">
      {error.message}
      <StackTrace trace={error.stack} />
      {error.cause ? (
        <>
          {error.cause.message}
          <StackTrace trace={error.cause.stack} />
        </>
      ) : null}
    </Notification>
  );
};
