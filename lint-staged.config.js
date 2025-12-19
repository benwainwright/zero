/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */
export default {
  '*.{js,ts,tsx,jsx,json}': ['pnpm exec nx affected --targets test --files'],
};
