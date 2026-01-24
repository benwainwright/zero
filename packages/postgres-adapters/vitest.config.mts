import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/postgres-adapters',
  plugins: [
    tsconfigPaths({
      projects: [
        path.join(import.meta.dirname, 'tsconfig.lib.json'),
        path.join(import.meta.dirname, 'tsconfig.spec.json'),
      ],
    }),
  ],
  test: {
    name: '@zero/postgres-adapters',
    globalSetup: './src/test-helpers/global-setup.ts',
    maxConcurrency: 1,
    maxWorkers: 1,
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    fileParallelism: false,
    reporters: ['default'],
    coverage: {
      enabled: true,
      include: ['./src/**/*.ts'],
      exclude: [
        './src/**/*.test.ts',
        './src/**/*.spec.ts',
        './src/test-helpers/**/*',
      ],
      thresholds: {
        functions: 80,
        lines: 80,
        statements: 80,
        branches: 40,
      },
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
