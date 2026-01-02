/// <reference types='vitest' />
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteStaticCopy } from 'vite-plugin-static-copy';

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

export default defineConfig(() => ({
  root: import.meta.dirname,
  cacheDir: '../../node_modules/.vite/packages/sqlite-adapters',
  plugins: [
    tsconfigPaths({
      projectDiscovery: 'lazy',
      projects: [
        path.join(import.meta.dirname, 'tsconfig.lib.json'),
        path.join(import.meta.dirname, 'tsconfig.spec.json'),
      ],
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/better-sqlite3/build/Release/better_sqlite3.node',
          dest: 'bindings/better_sqlite3.node',
        },
      ],
    }),
    injectFilenameForBadPkg(),
  ],
  ssr: {
    noExternal: ['better-sqlite3'], // force bundling so plugins can transform it
  },
  optimizeDeps: {
    exclude: ['better-sqlite3'], // stop prebundle in dev so it can be processed
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    ssr: true,
    lib: {
      entry: 'src/index.ts',
      name: '@zero/sqlite-adapters',
      fileName: 'index',
      formats: ['es' as const],
    },
    rollupOptions: {
      external: [],
    },
  },
}));
