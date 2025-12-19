import {
  type Tree,
  formatFiles,
  generateFiles,
  installPackagesTask,
  joinPathFragments,
  readProjectConfiguration,
} from '@nx/devkit';

import { libraryGenerator } from '@nx/js';
import type { CreateLibrarySchema } from './schema.ts';

const newLibrary = async (tree: Tree, schema: CreateLibrarySchema) => {
  const directory = `packages/${schema.name}`;

  await libraryGenerator(tree, {
    name: schema.name,
    directory,
    publishable: false,
    importPath: `@zero/${schema.name}`,
    linter: 'eslint',
    unitTestRunner: 'vitest',
    minimal: true,
    setParserOptionsProject: true,
    skipTypeCheck: true,
    strict: true,
    testEnvironment: 'node',
    useProjectJson: false,
  });

  const libraryRoot = readProjectConfiguration(tree, schema.name).root;

  generateFiles(tree, joinPathFragments(__dirname, './files'), libraryRoot, {
    ...schema,
    packageDir: libraryRoot,
  });

  const underScoreFiles = [
    'tsconfig.json',
    'tsconfig.lib.json',
    'tsconfig.spec.json',
    'package.json',
    'src/index.ts',
  ];

  underScoreFiles.forEach((file) => {
    tree.rename(`${libraryRoot}/${file}_`, `${libraryRoot}/${file}`);
  });

  tree.delete(`${libraryRoot}/vite.config.ts`);

  await formatFiles(tree);
  return () => {
    installPackagesTask(tree);
  };
};

export default newLibrary;
