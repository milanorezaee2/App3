#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.resolve(process.env.DIST_DIR || path.join(root, 'dist'));
const assetName = 'language-hero-background.jpg';
const builtAsset = path.join(dist, 'assets', assetName);

const sourceRoots = ['app', 'components', 'lib', 'hooks'];
const rootFiles = ['index.js', 'app.json', 'app.config.js', 'babel.config.js'];
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.jsx', '.ts', '.tsx']);

function collectTextFiles(target, files = []) {
  if (!fs.existsSync(target)) return files;
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (textExtensions.has(path.extname(target).toLowerCase())) files.push(target);
    return files;
  }
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory()) collectTextFiles(path.join(target, entry.name), files);
    else if (textExtensions.has(path.extname(entry.name).toLowerCase())) files.push(path.join(target, entry.name));
  }
  return files;
}

if (!fs.existsSync(builtAsset)) {
  console.log(`Optional unused web asset is already absent: ${path.relative(root, builtAsset)}`);
  process.exit(0);
}

const sourceFiles = [
  ...sourceRoots.flatMap(directory => collectTextFiles(path.join(root, directory))),
  ...rootFiles.map(file => path.join(root, file)).filter(file => fs.existsSync(file)),
];
const outputFiles = collectTextFiles(dist).filter(file => path.resolve(file) !== path.resolve(builtAsset));
const references = [...sourceFiles, ...outputFiles].filter(file => {
  try {
    return fs.readFileSync(file, 'utf8').includes(assetName);
  } catch {
    return false;
  }
});

if (references.length) {
  console.warn(`Keeping ${assetName}; a text reference was found in:`);
  for (const file of references) console.warn(`- ${path.relative(root, file)}`);
  process.exit(0);
}

fs.unlinkSync(builtAsset);
console.log(`Omitted unused public asset from web output only: ${path.relative(root, builtAsset)} (${fs.statSync(path.join(root, 'public', 'assets', assetName)).size} bytes). Source images were not changed.`);
