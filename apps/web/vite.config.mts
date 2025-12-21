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
      projects: [
        path.join(import.meta.dirname, 'tsconfig.app.json'),
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
  },
  // test: {
  //   name: '@zero/web',
  //   watch: false,
  // },
  //   globals: true,
  //   environment: 'jsdom',
  //   include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  //   reporters: ['default'],
  //   coverage: {
  //     reportsDirectory: './test-output/vitest/coverage',
  //     provider: 'v8' as const,
  //   },
  // },
}));
