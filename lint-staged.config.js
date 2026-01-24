import path from 'path';

/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{js,ts,tsx,jsx,json}': [
    'pnpm exec nx sync',
    (files) =>
      `pnpm exec nx affected --targets test,lint --files --exclude="@zero/postgres-adapters@ ${files
        .map((file) => path.relative(process.cwd(), file))
        .join(',')}`,
  ],
};
