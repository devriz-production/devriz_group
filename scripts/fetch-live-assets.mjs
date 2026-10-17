// One-off: copies the brand assets that already exist on the live WordPress site
// (logo, leadership portraits, press logos) into raw-assets/live so the rebuild can
// reuse them. Generated photography does not come from here, see IMAGE-PROMPTS.md.
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'raw-assets', 'live');
const base = 'https://devrizgroup.com/wp-content/uploads/';

const files = {
  'brand/logo.webp': '2026/07/dg-scaled.webp',
  'brand/group-wheel.webp': '2026/05/vf.webp',
  'brand/hero-current.webp': '2026/07/ChatGPT-Image-Jul-28-2026-03_51_34-PM.webp',
  'people/krishna-kumar-singh.jpeg': '2026/05/Chairmain-of-devriz-group.jpeg',
  'people/brajesh-varman.webp': '2026/08/ChatGPT-Image-Aug-19-2026-04_35_12-PM.webp',
  'people/dev-singh.webp': '2026/08/ChatGPT-Image-Aug-19-2026-04_26_22-PM.webp',
  'people/amy-aliya.webp': '2026/08/ChatGPT-Image-Aug-19-2026-04_32_30-PM.webp',
  'people/rahul-mayank.webp': '2026/08/ChatGPT-Image-Aug-19-2026-04_17_36-PM.webp',
  'office/chairman-office.webp': '2026/02/1400x900-Chairman-Office-Environment-scaled.webp',
  'office/boardroom.webp': '2026/02/800x600-Boardroom-Meeting.webp',
  'office/executive-workspace.webp': '2026/02/800x600-ExecutiveWorkspace.webp',
  'logos/devriz-group.png': '2025/11/1.png',
  'logos/devriz-fashion-lifestyle.png': '2025/11/5.png',
  'logos/kotil-skin-science.png': '2025/11/4.png',
  'logos/global-alpha-tech.png': '2025/11/2.png',
  'logos/autodell.png': '2025/11/9.png',
  'press/dailyhunt.png': '2025/12/DailyHunt-3.png',
  'press/zee-news-world.png': '2025/12/Zee-News-World-1.png',
  'press/news-18-nation.png': '2025/12/News-18-Nation-2.png',
  'press/yorsvia.png': '2025/12/Yorsvia-2.png',
  'press/us-times-world.png': '2025/12/US-times-world-2.png',
  'press/think-of-india.png': '2025/12/Think-of-India-2.png',
  'press/startup24-live.png': '2025/12/Startup24-live-2.png',
  'press/start-up-story-18.png': '2025/12/Start-up-story-18-2.png',
  'press/rv-rising-news.png': '2025/12/RV-Rising-NEWS-2.png',
  'press/news-vachan.png': '2025/12/News-Vachan-2.png',
  'press/news-sport.png': '2025/12/News-Sport-2.png',
  'press/news-on-board.png': '2025/12/News-On-Board-2.png',
  'press/news-motion.png': '2025/12/News-Motion-2.png',
  'press/forbes-of-india.png': '2025/12/Forbes-of-india-2.png',
  'press/first-look-times.png': '2025/12/First-Look-Times-2.png',
  'press/filmyapa.png': '2025/12/FIlmyapa-2.png',
  'press/filmi-chakkar.png': '2025/12/Filmi-Chakkar-2.png',
  'press/filmi-buddy.png': '2025/12/Filmi-Buddy-2.png',
  'press/enter-10.png': '2025/12/Enter-10-2.png',
  'press/desh-duniya-times.png': '2025/12/Desh-Duniya-Times-2.png',
  'press/business-live-now.png': '2025/12/Business-Live-Now-2.png',
  'press/attention-pedia.png': '2025/12/Attention-Pedia-2.png',
  'press/attention-mumbai.png': '2025/12/Attention-Mumbai-2.png',
  'press/attention-india-news.png': '2025/12/Attension-India-News-2.png',
};

let ok = 0;
for (const [dest, src] of Object.entries(files)) {
  const target = path.join(out, dest);
  await mkdir(path.dirname(target), { recursive: true });
  try {
    await stat(target);
    ok++;
    continue;
  } catch {}
  const res = await fetch(base + src);
  if (!res.ok) {
    console.log(`MISS ${res.status} ${src}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(target, buf);
  console.log(`${String(Math.round(buf.length / 1024)).padStart(6)} KB  ${dest}`);
  ok++;
}
console.log(`${ok}/${Object.keys(files).length} assets in raw-assets/live`);
