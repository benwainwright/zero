/// <reference types='vitest' />
import { builtinModules } from 'module';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const nodeBuiltins = [
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
];

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/postgres-adapters',
  plugins: [
    tsconfigPaths({
      projects: [
        path.join(import.meta.dirname, 'tsconfig.lib.json'),
        path.join(import.meta.dirname, 'tsconfig.spec.json'),
      ],
    }),
  ],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: '@zero/postgres-adapters',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: nodeBuiltins,
    },
  },
}));
