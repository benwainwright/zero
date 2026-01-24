import fs from 'fs';
import path from 'path';

function findNearestPackageName(startPath) {
  let currentDir = fs.statSync(startPath).isDirectory()
    ? startPath
    : path.dirname(startPath);

  while (true) {
    const pkgPath = path.join(currentDir, 'package.json');

    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      return pkg.name;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      // Reached filesystem root
      return undefined;
    }

    currentDir = parentDir;
  }
}

const inputPath = process.argv[2];
if (!inputPath) {
  throw new Error('Usage: node find-package.js <file-or-dir>');
}

const packageName = findNearestPackageName(path.resolve(inputPath));
console.log(packageName);
