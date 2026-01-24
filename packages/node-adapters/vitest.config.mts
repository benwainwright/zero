import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/node-adapters',
  plugins: [
    tsconfigPaths({
      root: path.join(import.meta.dirname, '..', '..'),
      configNames: ['tsconfig.lib.json', 'tsconfig.spec.json'],
    }),
  ],
  test: {
    name: '@zero/',
    globalSetup: './src/test-helpers/global-setup.ts',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    maxWorkers: 1,
    reporters: ['default'],
    coverage: {
      enabled: true,
      include: ['./src/**/*.ts'],
      exclude: ['./src/**/*.test.ts', '*./src/**/*.spec.ts'],
      thresholds: {
        functions: 5.26,
        lines: 3.79,
        statements: 4.76,
        branches: 0,
      },
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
