import type { Toolkit } from '@aws-cdk/toolkit-lib';
import { useToolkit } from '@hooks';
import { useEffect } from 'react';
import { useApp } from 'ink';
import { Deployments, Errors, MessageLog } from '@components';

interface CdkUxProps {
  onLoad: (toolkit: Toolkit) => Promise<void>;
  logLimit?: number;
}

export const CdkUx = ({ onLoad, logLimit = 5 }: CdkUxProps) => {
  const { exit } = useApp();
  const { deployments, toolkit, messages, errors, withErrorHandling } =
    useToolkit({
      includeMessageLevels: ['error', 'info', 'result', 'warn'],
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
    <>
      <Errors errors={errors} />
      <Deployments deployments={deployments} />
      <MessageLog logLimit={logLimit} messages={messages} />
    </>
  );
};
