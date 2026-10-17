// Creates the one-time setup key for the admin panel.
//
// The key itself is written to ADMIN-SETUP-KEY.txt (kept out of git and never
// uploaded). Only a fingerprint of it goes into the site, in public/api/setup-key.php.
// Whoever opens /admin/ first must type the key to create the admin password,
// so a stranger who finds the page cannot claim it.
//
//   npm run admin:key          create a key if there is none
//   npm run admin:key -- --new replace the key (for example after a password reset)
import { createHash, randomInt } from 'node:crypto';
import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const keyFile = path.join(root, 'ADMIN-SETUP-KEY.txt');
const hashFile = path.join(root, 'public', 'api', 'setup-key.php');

if (existsSync(keyFile) && existsSync(hashFile) && !process.argv.includes('--new')) {
  console.log('A setup key already exists in ADMIN-SETUP-KEY.txt. Use "npm run admin:key -- --new" to replace it.');
  process.exit(0);
}

// No 0/O or 1/I, so the key can be read aloud or typed without mistakes.
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const groups = Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => alphabet[randomInt(alphabet.length)]).join(''));
const key = groups.join('-');
const fingerprint = createHash('sha256').update(groups.join('')).digest('hex');

await writeFile(
  keyFile,
  `Devriz Group website: admin setup key

${key}

What this is for
  The first time someone opens https://devrizgroup.com/admin/ the page asks for
  this key and lets them choose the admin password. After that the key does
  nothing until the password is reset.

Keep this file private. Do not email it, commit it or upload it.

If the admin password is forgotten
  1. In Hostinger File Manager, open the dg-data folder (beside public_html)
     and delete admin.json. Openings and newsletters are not affected.
  2. Open /admin/ and use this key again to choose a new password.
`,
);
await writeFile(hashFile, `<?php\n// Fingerprint of the admin setup key. The key itself is in ADMIN-SETUP-KEY.txt, which is never uploaded.\nreturn '${fingerprint}';\n`);

console.log('Setup key written to ADMIN-SETUP-KEY.txt. Its fingerprint is in public/api/setup-key.php.');
console.log('Rebuild and upload the site for the new key to take effect.');
