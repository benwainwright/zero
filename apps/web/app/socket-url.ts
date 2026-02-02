import type { FrontendConfig } from '@zero/backend';
import { useEffect, useState } from 'react';

const getSocketUrl = async () => {
  if (
    process.env['NODE_ENV'] !== 'production' &&
    process.env['NODE_ENV'] !== 'staging'
  ) {
    return `ws://localhost:3000`;
  }

  const config = await fetch('/config.json');

  if (!config.ok) {
    throw new Error(`Error fetching config`);
  }

  const { backendHost, backendPort, backendProtocol }: FrontendConfig =
    await config.json();

  return `${backendProtocol}://${backendHost}:${backendPort}`;
};

export const useSocketUrl = () => {
  const [socketUrl, setSocketUrl] = useState<string>();

  useEffect(() => {
    (async () => {
      setSocketUrl(await getSocketUrl());
    })();
  }, []);

  return socketUrl;
};
