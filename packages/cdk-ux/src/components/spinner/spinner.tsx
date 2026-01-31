import InkSpinner from 'ink-spinner';
import { Text } from 'ink';

interface SpinnerProps {
  show: boolean;
  text: string;
  color?: string;
}

export const Spinner = ({ show, text, color }: SpinnerProps) => {
  return (
    show && (
      <Text>
        <Text color={color ?? 'green'}>
          <InkSpinner type="dots" />
        </Text>
        {` ${text}`}
      </Text>
    )
  );
};
