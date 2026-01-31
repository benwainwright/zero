import {
  Toolkit,
  ToolkitError,
  type AssemblyError,
  type AuthenticationError,
  type ContextProviderError,
  type IoMessageLevel,
} from '@aws-cdk/toolkit-lib';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Host } from '@lib';
import type {
  IDeployableStack,
  IErrorCallback,
  IErrorMessage,
  IMessage,
} from '@types';
import { onStackMonitoringStarted } from './on-stack-monitoring-started.ts';
import { onStackDeployProgress } from './on-stack-deploy-progress.ts';
import { onStackMonitoringFinish } from './on-stack-monitoring-finish.ts';
import { onStackActivity } from './on-stack-activity.ts';
import { onStackDeployComplete } from './on-stack-deploy-complete.ts';

export const useToolkit = (config?: {
  includeMessageLevels?: IoMessageLevel[];
}) => {
  const [deployments, setDeployments] = useState<IDeployableStack[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [errors, setErrors] = useState<IErrorMessage[]>([]);

  const errorCallbacks = useRef<IErrorCallback[]>([]).current;

  const host = useRef(new Host()).current;

  const withErrorHandling = async (callback: () => Promise<void> | void) => {
    try {
      await callback();
    } catch (error) {
      if (ToolkitError.isAuthenticationError(error)) {
        const handlers = errorCallbacks.filter(
          (callback) => callback.type === 'all' || callback.type === 'auth'
        );

        for (const handler of handlers) {
          await handler.callback(error);
        }
      } else if (ToolkitError.isAssemblyError(error)) {
        const handlers = errorCallbacks.filter(
          (callback) => callback.type === 'all' || callback.type === 'assembly'
        );

        for (const handler of handlers) {
          await handler.callback(error);
        }
      } else if (ToolkitError.isContextProviderError(error)) {
        const handlers = errorCallbacks.filter(
          (callback) => callback.type === 'all' || callback.type === 'context'
        );

        for (const handler of handlers) {
          await handler.callback(error);
        }
      } else if (ToolkitError.isToolkitError(error)) {
        const handlers = errorCallbacks.filter(
          (callback) => callback.type === 'all' || callback.type === 'toolkit'
        );

        for (const handler of handlers) {
          await handler.callback(error);
        }
      } else if (error instanceof Error) {
        const handlers = errorCallbacks.filter(
          (callback) => callback.type === 'all'
        );

        for (const handler of handlers) {
          await handler.callback(error);
        }
      } else {
        throw error;
      }
    }
  };

  const onAuthError = useCallback(
    (callback: (error: AuthenticationError) => Promise<void> | void) => {
      errorCallbacks.push({
        type: 'auth',
        callback,
      });
    },
    [errorCallbacks]
  );

  const onAssemblyError = useCallback(
    (callback: (error: AssemblyError) => Promise<void> | void) => {
      errorCallbacks.push({
        type: 'assembly',
        callback,
      });
    },
    [errorCallbacks]
  );

  const onContextProviderError = useCallback(
    (callback: (error: ContextProviderError) => Promise<void> | void) => {
      errorCallbacks.push({
        type: 'context',
        callback,
      });
    },
    []
  );

  const onError = useCallback(
    (callback: (error: Error) => Promise<void> | void) => {
      errorCallbacks.push({
        type: 'all',
        callback,
      });
    },
    []
  );

  useEffect(() => {
    onError((error) => {
      setErrors((current) => [
        ...current,
        {
          message:
            error.cause && error.cause instanceof Error
              ? error.cause.message
              : error.message,
          timestamp: new Date(),
        },
      ]);

      setDeployments((current) => {
        return current.map((deployment) => ({
          ...deployment,
          status: deployment.status === 'started' ? 'error' : deployment.status,
        }));
      });
    });

    onStackMonitoringStarted(host, setDeployments);
    onStackMonitoringFinish(host, setDeployments);
    onStackDeployProgress(host, setDeployments);
    onStackActivity(host, setDeployments);
    onStackDeployComplete(host, setDeployments);

    const handler:
      | Console['log']
      | Console['error']
      | Console['warn']
      | Console['info']
      | Console['debug'] = (...args) => {
      setMessages((current) => [
        ...current,
        {
          message: args.join(', '),
          timestamp: new Date(),
          level: 'info',
          code: undefined,
        },
      ]);
    };

    console.log = handler;
    console.info = handler;
    console.warn = handler;
    console.debug = handler;
    console.error = handler;

    host.onRest((message) => {
      if (
        config?.includeMessageLevels &&
        !config.includeMessageLevels.includes(message.level)
      ) {
        return;
      }
      setMessages((oldMessages) => [
        ...oldMessages,
        {
          message: message.message,
          code: 'code' in message ? message.code : undefined,
          level: message.level,
          timestamp: new Date(),
        },
      ]);
    });
  }, []);

  const onToolkitError = useCallback(
    (callback: (error: ToolkitError) => Promise<void> | void) => {
      errorCallbacks.push({
        type: 'toolkit',
        callback,
      });
    },
    []
  );

  const toolkit = useRef(
    new Toolkit({
      ioHost: host,
      emojis: false,
      color: false,
    })
  );

  return {
    deployments,
    toolkit: toolkit.current,
    messages,
    errors,
    withErrorHandling,
    onToolkitError,
    onAssemblyError,
    onAuthError,
    onError,
    onContextProviderError,
  };
};
