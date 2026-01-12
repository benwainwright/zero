/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

const protocol = JSON.stringify(process.env['BACKEND_PROTOCOL']) ?? 'ws';
const host = JSON.stringify(process.env['BACKEND_HOST']) ?? 'localhost';
const port = JSON.stringify(process.env['BACKEND_PORT']) ?? 3000;

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/apps/web',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  define: {
    "process.env['BACKEND_PROTOCOL']": protocol,
    "process.env['BACKEND_HOST']": host,
    "process.env['BACKEND_PORT']": port,
  },
  plugins: [
    !process.env['VITEST'] && reactRouter(),
    tsconfigPaths({
      projectDiscovery: 'lazy',
      projects: [
        path.join(import.meta.dirname, 'tsconfig.app.json'),
        path.join(
          import.meta.dirname,
          '..',
          '..',
          'packages',
          'websocket-adapter',
          'tsconfig.lib.json'
        ),
        path.join(
          import.meta.dirname,
          '..',
          '..',
          'packages',
          'react-api',
          'tsconfig.lib.json'
        ),

        path.join(import.meta.dirname, 'tsconfig.spec.json'),
      ],
    }),
  ],
  build: {
    ssr: false,
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
