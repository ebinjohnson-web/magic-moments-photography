import { cp, writeFile } from 'node:fs/promises';
// Copy the successful export only; the current Pages branch serves /docs.
await cp(new URL('../out/', import.meta.url), new URL('../docs/', import.meta.url), { recursive: true });
await writeFile(new URL('../docs/.nojekyll', import.meta.url), '');
console.log('GitHub Pages export ready in docs/; custom domain preserved.');
