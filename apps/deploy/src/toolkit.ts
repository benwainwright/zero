import { Toolkit, type IIoHost } from '@aws-cdk/toolkit-lib';

export const getToolkit = (environment: 'staging' | 'production') =>
  new Toolkit({
    ioHost: {
      notify: async function (msg) {
        switch (msg.level) {
          case 'error':
            console.error(`[${msg.time}] ERROR: ${msg.message}`);
            break;
          case 'warn':
            console.warn(`[${msg.time}] WARNING: ${msg.message}`);
            break;
          case 'info':
            console.info(`[${msg.time}] INFO: ${msg.message}`);
            break;
          case 'debug':
            console.debug(`[${msg.time}] DEBUG: ${msg.message}`);
            break;
          case 'trace':
            console.debug(`[${msg.time}] TRACE: ${msg.message}`);
            break;
          default:
            console.log(`[${msg.time}] ${msg.level}: ${msg.message}`);
        }
      },

      requestResponse: async (msg) => {
        return msg.defaultResponse;
      },
    } satisfies IIoHost, // Explicitly cast to
  });
