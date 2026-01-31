import { Message, Section } from '@components';
import type { IErrorMessage } from '@types';

interface ErrorsProps {
  errors: IErrorMessage[];
}

export const Errors = ({ errors }: ErrorsProps) => {
  return errors.length > 0 ? (
    <Section title="Error">
      {errors.map((message) => (
        <Message
          key={message.message}
          message={{ message: message.message, level: 'error' }}
        />
      ))}
    </Section>
  ) : null;
};
