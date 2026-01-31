import type {
  AssemblyError,
  AuthenticationError,
  ContextProviderError,
  ToolkitError,
} from '@aws-cdk/toolkit-lib';

export type IErrorCallback =
  | {
      type: 'auth';
      callback: (error: AuthenticationError) => void | Promise<void>;
    }
  | {
      type: 'assembly';
      callback: (error: AssemblyError) => void | Promise<void>;
    }
  | {
      type: 'context';
      callback: (error: ContextProviderError) => void | Promise<void>;
    }
  | {
      type: 'toolkit';
      callback: (error: ToolkitError) => void | Promise<void>;
    }
  | {
      type: 'all';
      callback: (error: Error) => void | Promise<void>;
    };
