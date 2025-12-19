import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/bootstrap',
  plugins: [
    tsconfigPaths({
      projects: [
        path.join(import.meta.dirname, 'tsconfig.lib.json'),
        path.join(import.meta.dirname, 'tsconfig.spec.json'),
      ],
    }),
  ],
  test: {
    name: '@zero/bootstrap',
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
        autoUpdate: true,
        functions: 42.85,
        lines: 34.78,
        statements: 34.78,
        branches: 0,
      },
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
