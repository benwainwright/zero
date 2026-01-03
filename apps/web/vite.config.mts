/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

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
