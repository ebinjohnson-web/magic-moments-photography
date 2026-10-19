import { access, cp, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'out');
const destination = resolve(root, 'docs');
// docs is generated only. Check the successful build and exact output path
// before replacing it, so stale Next.js bundles cannot accumulate across builds.
await access(resolve(source, 'index.html'));
await access(resolve(source, 'CNAME'));
if (destination !== resolve(root, 'docs') || dirname(destination) !== root) {
  throw new Error('Refusing to replace a directory outside the project output.');
}
await rm(destination, { recursive: true, force: true });
await cp(source, destination, { recursive: true });
await writeFile(resolve(destination, '.nojekyll'), '');
console.log('GitHub Pages export ready in docs/; custom domain preserved.');
