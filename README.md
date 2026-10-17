# Devriz Group website

The corporate site for Devriz Group: 57 static pages built with Astro and Tailwind, plus a small password-protected admin panel, made to be uploaded to Hostinger as plain files.

It replaces the WordPress site at devrizgroup.com. Every address the old navigation linked to exists here with the same URL, including the 40 or so that returned "Page not found" on WordPress (companies, sector pages, impact, newsroom, policies).

## Commands

```bash
npm install
```

```bash
npm run dev
```

The dev server runs at http://localhost:5183.

```bash
npm run build
```

Writes the finished site to `dist/`. That folder is what gets uploaded. See [HOSTING.md](HOSTING.md).

```bash
npm run check
```

Builds, then verifies every internal link, every in-page anchor, one `<h1>` per page, a title and description on every page, and that no em or en dashes are in the copy. Run it before every upload.

```bash
npm run prompts
```

Rewrites [IMAGE-PROMPTS.md](IMAGE-PROMPTS.md) from `src/data/slots.ts` and marks which photographs have been supplied.

## Where things are

| To change | Edit |
|---|---|
| Address, phone, email, GSTIN, headline figures, menus, footer | `src/data/site.ts` |
| The seven sectors | `src/data/sectors.ts` |
| Companies and trusts | `src/data/companies.ts` |
| Chairman, leaders, quotes, governance text | `src/data/people.ts` |
| Hiring steps, careers FAQ, starter list of roles | `src/data/careers.ts` |
| Live career openings and newsletters | the admin panel at `/admin/` |
| Press releases, articles, media coverage links | `src/data/news.ts` |
| Homepage FAQ | `src/data/faqs.ts` |
| Policies (privacy, terms, code of conduct and others) | `src/content/policies/*.md` |
| Colours, type sizes, buttons, form styles | `src/styles/global.css` |
| Photographs | `src/assets/photo/` (see below) |

Adding a company, a sector, a news item or a policy file creates its page, its directory card, its search entry and its sitemap entry on the next build. No page file needs touching.

## Photographs

Each image has a slot with a fixed name, listed in `src/data/slots.ts`. Save a file with that name in `src/assets/photo/` and rebuild. The site resizes and compresses it and fills the placeholder. Until then the page shows a labelled grey panel.

Prompts for every slot are in [IMAGE-PROMPTS.md](IMAGE-PROMPTS.md). All 20 generated photographs are in place; two optional slots for real gaushala photos are still open.

To bring in new or replacement images, save them anywhere with the slot name as the file name (the `sector-` and `company-` prefixes are optional) and run:

```bash
npm run photos -- "C:/Users/HP/Downloads"
```

It keeps the untouched originals in `raw-assets/generated/`, writes a high-quality JPEG to `src/assets/photo/`, and lists any slot still empty.

Portraits live in `src/assets/people/`, press logos in `src/assets/press/`, and the logo in `src/assets/brand/`. The originals copied from the old site are in `raw-assets/live/`; `npm run assets:brand` regenerates the logo variants, favicons and share image from them.

## Forms

The contact form (general, partnership, vendor registration, media, feedback) and the careers application both post to `public/api/enquiry.php`, which emails the corporate office. It needs PHP, so it works on Hostinger and not on the local dev server.

When the endpoint cannot be reached, the form does not lose what was typed. It offers a "Send by email instead" button that opens the visitor's mail app with everything filled in.

Links can preselect a form state:

- `/contact/?enquiry=vendor` (also `partnership`, `media`, `feedback`)
- `/contact/?enquiry=partnership&company=kotil-skin-science` adds "Regarding: Kotil Skin Science"
- `/careers/?role=graphic-designer-creative-executive#apply` preselects a role (the role title in lower case with hyphens)

## Admin panel

`/admin/` lets staff post career openings and upload newsletter PDFs behind a password. The page is in `src/pages/admin/`, its script is `src/scripts/admin.ts`, and the server side is PHP in `public/api/` (`admin.php`, `jobs.php`, `newsletters.php`, `newsletter-file.php`, `_lib.php`).

It needs PHP, so on the local dev server the admin shows a notice, the careers page shows its built-in list of roles, and the newsletter page shows its empty state. On Hostinger the careers page and `/newsroom/newsletter/` read from the admin's feeds.

Setup, daily use, backups and the password reset are in [HOSTING.md](HOSTING.md#the-admin-panel). The one-time setup key is in `ADMIN-SETUP-KEY.txt`, which is ignored by git and must never be uploaded or shared.

```bash
npm run admin:key
```

Creates the setup key if there is none. Add `-- --new` to replace it.

## Accessibility and display controls

The bar above the header has text size (A-, A, A+), a high-contrast mode and a light and dark theme. Choices are saved in the browser only (`dg-text-size`, `dg-contrast`, `dg-theme`). The theme follows the device setting until the visitor chooses.

There is a skip link, visible keyboard focus everywhere, labels on every field with errors announced inline, and all motion is switched off for visitors who ask their device for reduced motion.

## Design rules

These keep the site looking like one thing. Break them on purpose or not at all.

- One accent colour: the gold from the logo. It is the only filled button colour.
- Every corner is square. No rounded cards, pills or buttons.
- Headlines are Archivo, text is Geist, labels and figures are Geist Mono. All self-hosted.
- One theme per page. Sections do not flip between light and dark.
- No em dashes or en dashes in copy. `npm run check` fails the build if one appears.

## Things to confirm before launch

These came from the old site in conflicting or incomplete form. They are written conservatively here and need a decision from the group.

1. **Leadership titles.** The current homepage names Krishna Kumar Singh as Chairman and Dev Singh as Vice Chairman, and the site follows that. Older pages and the December 2025 press release call Dev Singh "Founder and Chairman". The press release on this site leaves the leadership line out.
2. **Company details.** Gramin Industries and Khanacap Foods have only one line of published description. Legal names and entity types follow the group's own chart and should be checked against registration documents.
3. **Milestone years.** Only 2018 (healthcare) is published. The other journey phases carry no year.
4. **"In development" verticals.** Ports and terminals, infrastructure platforms and capital markets are taken from the group's "coming soon" graphic.
5. **Headline figures.** 7 sectors, 20+ companies, 2,000+ team members and 3 states are as published on the old homepage. The directory lists 17 companies and 3 trusts.
6. **Policies.** All nine policy documents are drafts and need legal review. The grievance and data-request response targets in them are commitments.
7. **Procurement page.** The categories and steps are drafted from the business mix, not from an existing procurement policy.
8. **Social links.** Only LinkedIn had a real address on the old site, so only LinkedIn is shown.
