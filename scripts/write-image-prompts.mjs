// Writes IMAGE-PROMPTS.md from src/data/slots.ts so the brief and the site never
// disagree about a file name or size. Run with: npm run prompts
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slots, houseStyle } from '../src/data/slots.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const walk = async (dir) => {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(entry.name.replace(/\.[^.]+$/, ''));
  }
  return out;
};
const have = new Set(await walk(path.join(root, 'src', 'assets')));

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const ratio = (w, h) => `${w / gcd(w, h)}:${h / gcd(w, h)}`;

const generate = slots.filter((s) => s.kind === 'generate');
const real = slots.filter((s) => s.kind === 'real-photo');
const done = slots.filter((s) => have.has(s.id)).length;

const block = (s) => `### ${s.id}

- **Save as:** \`src/assets/photo/${s.id}.jpg\`
- **Size:** ${s.w} x ${s.h} px (${ratio(s.w, s.h)})
- **Used on:** ${s.usedOn}
- **Status:** ${have.has(s.id) ? 'supplied' : 'needed'}

\`\`\`text
${s.prompt} ${houseStyle} Aspect ratio ${ratio(s.w, s.h)}.
\`\`\`
`;

const md = `# Image prompts for the Devriz Group site

${done} of ${slots.length} photographs supplied. This file is generated from \`src/data/slots.ts\` by \`npm run prompts\`.

## How to hand images back

1. Generate each image with the prompt below, at the size shown or larger.
2. Save it with the exact file name given, as \`.jpg\`, \`.png\` or \`.webp\`.
3. Put it in \`src/assets/photo/\`.
4. Run \`npm run build\`. The matching placeholder on the site fills itself, and the image is resized and compressed automatically.

Nothing in the code needs to change. A slot with no file shows a labelled grey panel with its name and size, so missing images are easy to spot.

## House style

Every prompt below already ends with this, so the set looks like one shoot:

> ${houseStyle}

Checks before you accept an image: no readable text or logos anywhere, hands and faces look natural, clothing and settings look Indian and current, and the part of the frame the prompt says to keep empty really is empty.

## Photographs to generate (${generate.length})

${generate.map(block).join('\n')}
## Real photographs needed (${real.length})

These show real places, so a generated image should only ever be a stand-in.

${real.map(block).join('\n')}
## Portraits

The leadership portraits are real people and must stay real photographs. They are already in \`src/assets/people/\`, copied from the current site:

| File | Person |
|---|---|
| \`krishna-kumar-singh\` | Krishna Kumar Singh, Chairman |
| \`dev-singh\` | Dev Singh, Vice Chairman |
| \`amy-aliya\` | Amy Aliya, Co-Founder, Devriz Healthcare |
| \`rahul-mayank\` | Rahul Mayank, Partner, Devriz Healthcare |
| \`brajesh-varman\` | Brajesh Varman, Investor and Partner |

The Chairman's portrait has a pale grey backdrop and the other four have black. For a matched set, reshoot or re-background so all five share one backdrop, the same crop (head and shoulders, eyes one third from the top) and a 4:5 portrait shape at 1600 x 2000 px or larger. To replace one, save the new file under the same name in \`src/assets/people/\`.

## Interim images in use now

So the draft does not look empty, three images from the current site are in \`src/assets/interim/\`. Each is replaced automatically when the proper file arrives:

| Interim file | Replaced by |
|---|---|
| \`home-hero-current\` | \`home-hero\` |
| \`governance-boardroom\` | a new file with the same name in \`src/assets/photo/\` (delete the interim one) |
| \`chairman-office\`, \`executive-workspace\` | not used on any page yet |
`;

await writeFile(path.join(root, 'IMAGE-PROMPTS.md'), md);
console.log(`IMAGE-PROMPTS.md written: ${slots.length} slots, ${done} supplied.`);
