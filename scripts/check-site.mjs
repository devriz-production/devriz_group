// Post-build checks on dist/: every internal link and asset resolves, every in-page
// anchor exists, no page is missing a title or description, and no em or en dashes
// have slipped into the copy. Run with: npm run check
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
};

const exists = async (p) => {
  try {
    return await stat(p);
  } catch {
    return null;
  }
};

const files = (await walk(dist)).filter((f) => f.endsWith('.html'));
const idsByPage = new Map();
const pages = new Map();
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const url = '/' + path.relative(dist, file).replace(/\\/g, '/').replace(/index\.html$/, '');
  pages.set(url, html);
  idsByPage.set(url, new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));
}

const problems = [];
let links = 0;

for (const [url, html] of pages) {
  if (!/<title>[^<]{5,}<\/title>/.test(html)) problems.push(`${url}  missing <title>`);
  if (!/<meta name="description" content="[^"]{40,}"/.test(html)) problems.push(`${url}  missing or short meta description`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) problems.push(`${url}  expected exactly one <h1>, found ${(html.match(/<h1[\s>]/g) || []).length}`);

  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  const dash = visible.match(/[^\s]{0,24}[—–][^\s]{0,24}/);
  if (dash) problems.push(`${url}  em or en dash in copy: "${dash[0]}"`);

  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:|tel:|data:|#$)/.test(raw) || raw.startsWith('//')) continue;
    links++;
    const [pathname, hash] = raw.split('#');
    const clean = pathname.split('?')[0];
    if (clean === '' && hash) {
      if (!idsByPage.get(url).has(hash)) problems.push(`${url}  anchor #${hash} not on this page`);
      continue;
    }
    if (!clean.startsWith('/')) {
      if (clean.startsWith('?')) continue;
      problems.push(`${url}  relative link "${raw}"`);
      continue;
    }
    const target = path.join(dist, decodeURIComponent(clean));
    const info = await exists(target);
    if (!info) {
      problems.push(`${url}  broken link ${raw}`);
      continue;
    }
    if (info.isDirectory()) {
      if (!clean.endsWith('/')) problems.push(`${url}  link without trailing slash ${raw}`);
      if (!(await exists(path.join(target, 'index.html')))) problems.push(`${url}  no page at ${raw}`);
      else if (hash && !idsByPage.get(clean)?.has(hash)) problems.push(`${url}  anchor missing ${raw}`);
    }
  }
}

console.log(`${pages.size} pages, ${links} internal links checked`);
if (problems.length) {
  console.log(`${problems.length} problem(s):`);
  for (const p of [...new Set(problems)]) console.log('  ' + p);
  process.exit(1);
}
console.log('No problems found.');
