import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/bootstrap',
  server: {
    port: 3000,
  },
  plugins: [
    tsconfigPaths({
      projects: [path.join(import.meta.dirname, 'tsconfig.app.json')],
    }),
  ],
  ssr: {
    target: 'node' as const,
  },
  build: {
    ssr: true,
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      entry: 'src/start.ts',
      name: '@zero/bootstrap',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: [],
    },
  },
}));
