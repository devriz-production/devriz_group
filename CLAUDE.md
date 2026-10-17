# Devriz Group website

Corporate site for Devriz Group, replacing the WordPress site at devrizgroup.com. Static Astro 7 build with Tailwind v4, uploaded by hand to Hostinger. Owner: Nitin (tomar@devrizhealthcare.in), who directs the work and is not a full-time developer, so explain changes in plain language.

Read `README.md` first. It has the commands, the file map, the design rules and the list of facts still waiting on the group's sign-off. `HOSTING.md` covers deployment and the admin panel. `IMAGE-PROMPTS.md` lists every photograph and its prompt.

## Working here

- `npm run dev` serves the site on port 5183. `npm run check` builds and tests every link. Run it before calling anything done.
- The app's `preview_start` tool may look for `launch.json` in a different folder. If it fails, start the dev server from a shell in this folder instead.
- Content lives in `src/data/*.ts` and `src/content/policies/*.md`. Adding an entry there creates its page, search entry and sitemap entry. Do not hand-write new page files for companies, sectors, news or policies.
- Do not invent facts about the group (years, figures, people, addresses). If something is not in `src/data` or on the old site, ask or mark it as needing confirmation in the README list.

## Design rules (do not break without being asked)

- One accent colour: the logo gold. Square corners everywhere. Archivo for headlines, Geist for text, Geist Mono for labels.
- Light, dark and high-contrast modes all come from the CSS variables at the top of `src/styles/global.css`. Use the semantic colour classes (`bg-bg`, `text-ink`, `border-line`), never raw hex values in page markup.
- No em dashes or en dashes in any copy. `npm run check` fails if one appears.
- One label per call to action across the site: the contact intent is always "Contact us".
- Every section animates only with opacity and transform, and respects reduced motion. No scroll event listeners.

## Images

Nitin generates photographs himself and hands them back. Do not generate images with connected tools unless he asks. Each slot has a fixed file name in `src/data/slots.ts`; a file with that name in `src/assets/photo/` fills its placeholder on the next build. Leadership portraits are real people and stay real photographs.

## Admin panel

`/admin/` is a password-protected panel for posting career openings and uploading newsletters. The page is static; the logic is PHP in `public/api/` and only runs on the live server (or a local PHP server). Data is stored as JSON outside the web root in a `dg-data` folder, so re-uploading the site never overwrites it. See the admin section of `HOSTING.md` before changing any of it. Never put a password, the setup key or anything from `ADMIN-SETUP-KEY.txt` into chat, a commit or a page.
