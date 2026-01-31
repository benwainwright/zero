import { Section } from '@components';
import { Box, Text } from 'ink';
import type { IErrorMessage } from '@types';

interface ErrorsProps {
  errors: IErrorMessage[];
}

const normaliseString = (text: string) =>
  text
    .replace(/❌/g, '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join(' ');

export const Errors = ({ errors }: ErrorsProps) => {
  return errors.length > 0 ? (
    <Section
      beforeTitle={
        <Text color="red" bold>
          ❌
        </Text>
      }
      title="Error"
    >
      {errors.map((error) => (
        <Box justifyContent="flex-start" gap={1} flexGrow={2}>
          <Text color={'red'}>{normaliseString(error.message)}</Text>
        </Box>
      ))}
    </Section>
  ) : null;
};
