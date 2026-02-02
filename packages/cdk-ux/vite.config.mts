/// <reference types='vitest' />
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/cdk-ux',
  plugins: [
    tsconfigPaths({
      root: path.join(import.meta.dirname, '..', '..'),
      configNames: ['tsconfig.lib.json', 'tsconfig.spec.json'],
      skip: (dir) => dir.includes('cdk.out'),
    }),
  ],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    ssr: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/index.ts',
      name: '@zero/cdk-ux',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: [],
    },
  },
}));
