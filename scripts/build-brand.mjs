// Prepares brand assets from raw-assets/live:
//  - a transparent logo for light pages and a white-text version for dark pages
//  - favicons, the social share image and downloadable logo files
//  - trimmed press logos, leadership portraits and interim photographs in src/assets
// Run again whenever a file in raw-assets/live changes: npm run assets:brand
import { mkdir, copyFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const live = path.join(root, 'raw-assets', 'live');
const assets = path.join(root, 'src', 'assets');
const pub = path.join(root, 'public');

const INK = [8, 10, 14];
const PAPER = [246, 247, 249];
const GOLD = [229, 170, 23];
const NAVY = { r: 11, g: 20, b: 34, alpha: 1 };

const ensure = (dir) => mkdir(dir, { recursive: true });
const clamp = (n) => Math.max(0, Math.min(1, n));

// The source logo is black and gold on white. Rebuild it as a clean alpha mask:
// gold pixels keep their colour, everything else becomes the text colour.
async function recolourLogo(textColour) {
  const { data, info } = await sharp(path.join(live, 'brand', 'logo.webp'))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    const r = data[i] * a + 255 * (1 - a);
    const g = data[i + 1] * a + 255 * (1 - a);
    const b = data[i + 2] * a + 255 * (1 - a);
    const gold = r - b > 70 && r > 150;
    const colour = gold ? GOLD : textColour;
    const alpha = gold ? clamp((255 - b) / (255 - GOLD[2])) : clamp(1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255);
    out[i] = colour[0];
    out[i + 1] = colour[1];
    out[i + 2] = colour[2];
    out[i + 3] = Math.round(alpha * 255);
  }
  return sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png();
}

async function logos() {
  await ensure(path.join(assets, 'brand'));
  await ensure(path.join(pub, 'brand'));
  for (const [name, colour] of [
    ['logo-light', INK],
    ['logo-dark', PAPER],
  ]) {
    const full = await (await recolourLogo(colour)).toBuffer();
    const trimmed = await sharp(full).trim({ threshold: 1 }).toBuffer();
    await sharp(trimmed).resize({ height: 220 }).png({ compressionLevel: 9 }).toFile(path.join(assets, 'brand', `${name}.png`));
    await sharp(trimmed).resize({ width: 1600 }).png({ compressionLevel: 9 }).toFile(path.join(pub, 'brand', `devriz-group-${name}.png`));
  }
  const trimmedLight = await sharp(await (await recolourLogo(INK)).toBuffer()).trim({ threshold: 1 }).resize({ width: 1280 }).toBuffer();
  await sharp({ create: { width: 1600, height: 900, channels: 4, background: { r: 255, g: 255, b: 255, alpha: 1 } } })
    .composite([{ input: trimmedLight, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(pub, 'brand', 'devriz-group-logo-on-white.png'));
}

// Favicon: the wordmark's "D" in white on navy, with the gold dot.
async function favicons() {
  const dark = await (await recolourLogo(PAPER)).toBuffer();
  const meta = await sharp(dark).metadata();
  const k = meta.width / 2560;
  // sharp runs trim before extract whatever the call order, so do it in separate passes.
  // After trimming, the "D" is the first glyph: it starts at the left edge, just under the dot.
  const trimmed = await sharp(dark).trim({ threshold: 1 }).toBuffer();
  const cropped = await sharp(trimmed)
    .extract({ left: 0, top: Math.round(16 * k), width: Math.round(428 * k), height: Math.round(472 * k) })
    .toBuffer();
  const letter = await sharp(cropped).trim({ threshold: 1 }).resize({ height: 300 }).toBuffer();
  const dot = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><circle cx="48" cy="48" r="48" fill="rgb(229,170,23)"/></svg>');
  const base = await sharp({ create: { width: 512, height: 512, channels: 4, background: NAVY } })
    .composite([
      { input: letter, left: 104, top: 106 },
      { input: dot, left: 350, top: 66 },
    ])
    .png()
    .toBuffer();
  for (const [file, size] of [
    ['favicon-32.png', 32],
    ['favicon-48.png', 48],
    ['apple-touch-icon.png', 180],
    ['icon-192.png', 192],
    ['icon-512.png', 512],
  ]) {
    await sharp(base).resize(size, size).png({ compressionLevel: 9 }).toFile(path.join(pub, file));
  }
  await writeFile(
    path.join(pub, 'site.webmanifest'),
    JSON.stringify(
      {
        name: 'Devriz Group',
        short_name: 'Devriz Group',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        theme_color: '#0b1422',
        background_color: '#f6f7f9',
        display: 'browser',
      },
      null,
      2,
    ) + '\n',
  );
}

async function shareImage() {
  const logo = await sharp(await (await recolourLogo(PAPER)).toBuffer()).trim({ threshold: 1 }).resize({ width: 380 }).toBuffer();
  const text = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
      <rect x="80" y="372" width="96" height="6" fill="rgb(229,170,23)"/>
      <text x="80" y="452" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="50" font-weight="600" fill="#f6f7f9" letter-spacing="-1">Built on systems.</text>
      <text x="80" y="514" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="50" font-weight="600" fill="#f6f7f9" letter-spacing="-1">Grown with discipline.</text>
      <text x="80" y="568" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="22" fill="#9aa6b8">Healthcare. Technology. Infrastructure. Consumer. Agriculture. Logistics. Education.</text>
    </svg>`,
  );
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: NAVY } })
    .composite([
      { input: logo, left: 80, top: 96 },
      { input: text, left: 0, top: 0 },
    ])
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(pub, 'og.jpg'));
}

async function pressLogos() {
  const src = path.join(live, 'press');
  const dest = path.join(assets, 'press');
  await ensure(dest);
  for (const file of await readdir(src)) {
    await sharp(path.join(src, file))
      .flatten({ background: '#ffffff' })
      .trim({ threshold: 12 })
      .resize({ height: 120, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toFile(path.join(dest, file));
  }
}

async function copies() {
  const map = {
    'people/krishna-kumar-singh.jpeg': 'people/krishna-kumar-singh.jpeg',
    'people/brajesh-varman.webp': 'people/brajesh-varman.webp',
    'people/dev-singh.webp': 'people/dev-singh.webp',
    'people/amy-aliya.webp': 'people/amy-aliya.webp',
    'people/rahul-mayank.webp': 'people/rahul-mayank.webp',
    'office/chairman-office.webp': 'interim/chairman-office.webp',
    'office/boardroom.webp': 'interim/governance-boardroom.webp',
    'office/executive-workspace.webp': 'interim/executive-workspace.webp',
    'brand/hero-current.webp': 'interim/home-hero-current.webp',
  };
  for (const [from, to] of Object.entries(map)) {
    await ensure(path.dirname(path.join(assets, to)));
    await copyFile(path.join(live, from), path.join(assets, to));
  }
}

await logos();
await favicons();
await shareImage();
await pressLogos();
await copies();
console.log('Brand assets written to src/assets and public.');
