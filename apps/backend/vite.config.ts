import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';

import { fileURLToPath } from 'node:url';

const betterSqlitePkg = path.dirname(
  fileURLToPath(import.meta.resolve('better-sqlite3/package.json'))
);
const nativeBinary = path.join(
  betterSqlitePkg,
  'build',
  'Release',
  'better_sqlite3.node'
);

function injectFilenameForBadPkg() {
  const badPkgRe = /node_modules\/bindings\//;

  return {
    name: 'inject-filename',
    transform(src: string, id: string) {
      if (badPkgRe.test(id) && /\.[tj]sx?$/.test(id)) {
        console.log(id);
        return `const __filename = ${JSON.stringify(id)};\n` + src;
      }
      return null;
    },
  };
}

const getDbPackage = (env: Record<string, string>) => {
  const databaseModules: Record<string, string> = {
    postgres: './postgres.ts',
    sqlite: './sqlite.ts',
  };

  const db = env['DATABASE'];

  return databaseModules[db];
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    root: import.meta.dirname,
    cacheDir: '../../node_modules/.vite/packages/bootstrap',
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        '@database-adapters': getDbPackage(env),
      },
    },

    plugins: [
      tsconfigPaths({
        projects: [path.join(import.meta.dirname, 'tsconfig.app.json')],
      }),
      injectFilenameForBadPkg(),
      viteStaticCopy({
        targets: [
          {
            src: nativeBinary,
            dest: path.join(__dirname, 'dist', 'build'),
            rename: 'better_sqlite3.node',
          },
        ],
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
        rollupOptions: {},
      },
    },
  };
});
