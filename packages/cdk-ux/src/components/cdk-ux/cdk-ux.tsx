import type { IoMessageLevel, Toolkit } from '@aws-cdk/toolkit-lib';
import { useToolkit } from '@hooks';
import { useEffect } from 'react';
import { useApp, Box } from 'ink';
import { Deployments, Errors, MessageLog, Spinner } from '@components';

interface CdkUxProps {
  onLoad: (toolkit: Toolkit) => Promise<void>;
  logLimit?: number;
  includeMessageLevels?: IoMessageLevel[];
}

export const CdkUx = ({
  onLoad,
  logLimit = 10,
  includeMessageLevels = ['result', 'error', 'info', 'warn'],
}: CdkUxProps) => {
  const { exit } = useApp();
  const { deployments, toolkit, messages, errors, withErrorHandling } =
    useToolkit({
      includeMessageLevels,
    });

  useEffect(() => {
    (async () => {
      await withErrorHandling(async () => {
        await onLoad(toolkit);
        setTimeout(exit, 1000);
      });
    })();
  }, []);

  return (
    <Box paddingX={1} flexDirection="column">
      <Errors errors={errors} />
      <Deployments deployments={deployments} />
      <MessageLog logLimit={logLimit} messages={messages} />
      <Spinner
        show={messages.length === 0 && deployments.length === 0}
        text="Starting"
      />
    </Box>
  );
};
