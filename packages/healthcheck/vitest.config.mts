import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/healthcheck',
  plugins: [
    tsconfigPaths({
      root: path.join(import.meta.dirname, '..', '..'),
      configNames: ['tsconfig.lib.json', 'tsconfig.spec.json'],
    }),
  ],
  test: {
    name: '@zero/',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      enabled: true,
      include: ['./src/**/*.ts'],
      exclude: ['./src/**/*.test.ts', '*./src/**/*.spec.ts'],
      thresholds: {
        functions: 100,
        lines: 100,
        statements: 100,
        branches: 100,
      },
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
