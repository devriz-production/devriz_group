// Brings generated photographs into the site.
//
//   npm run photos -- "C:/Users/HP/Downloads"
//
// Looks in the given folder for files named after a slot in src/data/slots.ts
// (with or without the "sector-" / "company-" prefix, any case, spaces or hyphens),
// keeps the untouched original in raw-assets/generated/, and writes a
// high-quality JPEG to src/assets/photo/<slot>.jpg for the build to optimise.
import { copyFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { slots } from '../src/data/slots.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = process.argv[2];
if (!source) {
  console.log('Give the folder to import from, for example: npm run photos -- "C:/Users/HP/Downloads"');
  process.exit(1);
}

const normal = (name) => name.toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const lookup = new Map();
for (const slot of slots) {
  lookup.set(slot.id, slot);
  lookup.set(slot.id.replace(/^(sector|company)-/, ''), slot);
}

const originals = path.join(root, 'raw-assets', 'generated');
const photos = path.join(root, 'src', 'assets', 'photo');
await mkdir(originals, { recursive: true });
await mkdir(photos, { recursive: true });

const found = new Set();
for (const file of await readdir(source)) {
  if (!/\.(png|jpe?g|webp|avif)$/i.test(file)) continue;
  const slot = lookup.get(normal(file));
  if (!slot || found.has(slot.id)) continue;
  found.add(slot.id);
  const from = path.join(source, file);
  await copyFile(from, path.join(originals, `${slot.id}${path.extname(file).toLowerCase()}`));
  const meta = await sharp(from).metadata();
  await sharp(from).rotate().jpeg({ quality: 92, mozjpeg: true, chromaSubsampling: '4:4:4' }).toFile(path.join(photos, `${slot.id}.jpg`));
  const short = meta.width < slot.w * 0.75 ? `  (smaller than the ${slot.w} px asked for)` : '';
  console.log(`${slot.id.padEnd(36)} ${meta.width} x ${meta.height}${short}`);
}

const missing = slots.filter((s) => !found.has(s.id)).map((s) => s.id);
console.log(`\n${found.size} imported.${missing.length ? ` Not found: ${missing.join(', ')}` : ' Every slot is filled.'}`);
