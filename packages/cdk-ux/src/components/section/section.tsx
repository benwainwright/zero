import type { ReactNode } from 'react';
import { Box, Text } from 'ink';
import { WIDTH } from '@lib';

interface SectionProps {
  title?: string;
  children: ReactNode;
}

export const Section = ({ children, title }: SectionProps) => {
  return (
    <Box width={WIDTH} borderStyle={'single'} flexDirection="column">
      {title && (
        <Box
          width="100%"
          borderBottom
          borderStyle={'single'}
          borderTop={false}
          borderLeft={false}
          borderRight={false}
          paddingX={2}
        >
          <Text bold>{title}</Text>
        </Box>
      )}
      <Box paddingX={2} flexDirection="column">
        {children}
      </Box>
    </Box>
  );
};
