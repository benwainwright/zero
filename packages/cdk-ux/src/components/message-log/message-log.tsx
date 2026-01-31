import { Message, Section } from '@components';
import type { IMessage } from '@types';

interface IMessageLogProps {
  messages: IMessage[];
  logLimit: number;
}

export const MessageLog = ({ messages, logLimit }: IMessageLogProps) => {
  return messages.length > 0 ? (
    <Section title="Log">
      {messages.slice(-logLimit).map((message) => (
        <Message
          key={`${message.code}-${
            message.level
          }-${message.timestamp.toISOString()}`}
          message={message}
        />
      ))}
    </Section>
  ) : null;
};
