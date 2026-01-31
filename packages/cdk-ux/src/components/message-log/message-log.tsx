import { Message, Section } from '@components';
import { Text } from 'ink';
import type { IMessage } from '@types';

interface IMessageLogProps {
  messages: IMessage[];
  logLimit: number;
}

export const MessageLog = ({ messages, logLimit }: IMessageLogProps) => {
  return messages.length > 0 ? (
    <Section beforeTitle={<Text>📖</Text>} title="Log">
      {messages.slice(-logLimit).map((message, index) => (
        <Message
          key={`${message.code}-${
            message.level
          }-${message.timestamp.toISOString()}-${index}`}
          message={message}
        />
      ))}
    </Section>
  ) : null;
};
