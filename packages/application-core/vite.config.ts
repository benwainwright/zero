/// <reference types='vitest' />
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

import { builtinModules } from 'node:module';

const nodeBuiltins = [
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
];

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/application-core',
  define: {
    'process.env': {},
  },
  plugins: [
    tsconfigPaths({
      projects: [
        path.join(import.meta.dirname, 'tsconfig.lib.json'),
        path.join(import.meta.dirname, 'tsconfig.spec.json'),
      ],
    }),
  ],
  build: {
    ssr: true,
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: '@zero/application-core',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: nodeBuiltins,
    },
  },
}));
