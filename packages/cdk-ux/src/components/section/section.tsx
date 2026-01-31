import type { ReactNode } from 'react';
import { Box, Text } from 'ink';
import { WIDTH } from '@lib';

interface SectionProps {
  title?: string;
  children: ReactNode;
  beforeTitle?: ReactNode;
}

export const Section = ({
  children,
  title,
  beforeTitle = null,
}: SectionProps) => {
  return (
    <Box width={WIDTH} borderStyle={'single'} flexDirection="column">
      {title && (
        <Box
          gap={1}
          width="100%"
          borderBottom
          borderStyle={'single'}
          borderTop={false}
          borderLeft={false}
          borderRight={false}
          paddingX={2}
        >
          {beforeTitle}
          <Text bold>{title}</Text>
        </Box>
      )}
      <Box paddingX={2} flexDirection="column">
        {children}
      </Box>
    </Box>
  );
};
