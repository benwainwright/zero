import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/domain',
  plugins: [
    tsconfigPaths({
      projects: [
        path.join(import.meta.dirname, 'tsconfig.lib.json'),
        path.join(import.meta.dirname, 'tsconfig.spec.json'),
      ],
    }),
  ],
  test: {
    name: '@zero/domain',
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
        functions: 81.33,
        lines: 88.88,
        statements: 89.09,
        branches: 70,
      },
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));