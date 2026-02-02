/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { reactRouter } from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

const protocol = process.env['BACKEND_PROTOCOL'] ?? 'ws';
const host = process.env['BACKEND_HOST'] ?? 'localhost';
const port = process.env['BACKEND_PORT'] ?? 3000;

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
    "process.env['BACKEND_PROTOCOL']": JSON.stringify(protocol),
    "process.env['BACKEND_HOST']": JSON.stringify(host),
    "process.env['BACKEND_PORT']": JSON.stringify(port),
    'process.env.NODE_ENV': JSON.stringify(
      process.env['NODE_ENV'] || 'development'
    ),
  },
  plugins: [
    !process.env['VITEST'] && reactRouter(),
    tsconfigPaths({
      root: path.join(import.meta.dirname, '..', '..'),
      skip: (dir) => dir.includes('cdk.out'),
      configNames: [
        'tsconfig.lib.json',
        'tsconfig.spec.json',
        'tsconfig.app.json',
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
