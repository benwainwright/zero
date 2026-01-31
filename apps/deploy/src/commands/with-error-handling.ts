import { ToolkitError } from '@aws-cdk/toolkit-lib';

export const withErrorHandling = async (callback: () => Promise<void>) => {
  try {
    await callback();
  } catch (error) {
    if (ToolkitError.isAssemblyError(error)) {
      const causeString =
        error.cause && error.cause instanceof Error
          ? `[${error.cause.message}]`
          : ``;
      console.error('CDK app error:', error.message, causeString);
      console.error(error.stack);
    } else if (ToolkitError.isAuthenticationError(error)) {
      console.error('Authentication failed. Check your AWS credentials.');
    } else if (ToolkitError.isToolkitError(error)) {
      console.error('CDK Toolkit error:', error.message);
      console.error(error.stack);
    } else if (ToolkitError.isContextProviderError(error)) {
      console.error('Context provider error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};
