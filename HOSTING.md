# Putting the Devriz Group site on Hostinger

The site is static: HTML, CSS, images and one small PHP file for the forms. There is no database and nothing to keep running. Hostinger serves the contents of `dist/`, and `.htaccess` handles old addresses and caching.

**This replaces a WordPress site.** That is the one part of this that cannot be undone casually, so step 1 is a backup.

## 1. Back up WordPress first

In hPanel: Files > Backups, and take a full backup of files and the database. Or download `public_html` as a zip from File Manager and export the database from phpMyAdmin.

Keep it until the new site has been live for a few weeks. Restoring it is your rollback.

## 2. Create the mailbox the forms send from

The form handler sends mail from `no-reply@devrizgroup.com` to `info@devrizgroup.com`.

In hPanel: Emails > create `no-reply@devrizgroup.com`. If that mailbox does not exist, form mail is likely to be rejected or land in spam, and the forms will show their "send by email instead" fallback.

To use different addresses, change `RECIPIENT` and `FROM_ADDRESS` at the top of `public/api/enquiry.php` and rebuild.

## 3. Build

```bash
npm ci
```

```bash
npm run check
```

`check` builds the site and then tests every link. Do not upload if it reports a problem.

## 4. Try it on the preview address before touching the live site

Hostinger gives each site a temporary `*.hostingersite.com` address. Add the new site there first (or in a subfolder or staging site) and upload **the contents of `dist/`**, not the `dist` folder itself.

Turn on "Show hidden files" in File Manager and confirm `.htaccess` arrived. It starts with a dot, so File Manager hides it by default and some FTP clients skip it. Without it the old WordPress addresses 404.

| Visit | Expect |
|---|---|
| `/` | Homepage, hero image, menus open |
| `/about` (no slash) | Redirects to `/about/` |
| `/companies/kotil-skin-science/` | Company page |
| `/healthcare-pharma/` | 301 to `/businesses/healthcare-wellness/` |
| `/contact-us/` | 301 to `/contact/` |
| `/this-does-not-exist/` | The site's own "This page is not here" page |
| `/search/?q=kotil` | Two results |
| `/sitemap-index.xml`, `/robots.txt` | Served as files |
| Contact form, real details | "Thank you" panel, and the email arrives at info@devrizgroup.com |
| Careers form, real details | Same |
| `/admin/` | See "The admin panel" below |

If every page returns a 500 error, `.htaccess` is the cause. Rename it to `htaccess.txt`, confirm the site loads, then fix and rename back.

The form handler accepts posts from `devrizgroup.com`, `www.devrizgroup.com` and any `*.hostingersite.com` preview address. Add another host to `ALLOWED_HOSTS` in `enquiry.php` if you test somewhere else.

## 5. Go live

1. In `public_html`, move the WordPress files into a folder outside it (or delete them once the backup is confirmed).
2. Upload the contents of `dist/` into `public_html`, including `.htaccess` and the `api` and `admin` folders. Do not upload `ADMIN-SETUP-KEY.txt`.
3. In hPanel, set PHP to 8.0 or newer (Advanced > PHP Configuration).
4. In hPanel, turn on Force HTTPS (Security > SSL).
5. Run the table above again on the real domain.
6. Remove the WordPress database only after a few weeks without problems.

## 6. After launch

- **Google Search Console:** submit `https://devrizgroup.com/sitemap-index.xml`. Watch the Pages report for a week; the redirects in `.htaccess` should move the old addresses across.
- **Check the inbox.** Send one enquiry a week for the first month to confirm mail still arrives.

## Updating the site later

Edit, run `npm run check`, upload the contents of `dist/` again. Files under `_astro/` have a hash in their name, so they are cached for a year and a changed file always gets a new name. HTML is never cached hard, so an upload shows straight away.

Files that keep their name (`og.jpg`, favicons, the logo downloads in `/brand/`) are cached for a week. If you replace one, visitors may see the old one for up to seven days.

## The admin panel

`/admin/` is where staff post career openings and upload newsletters. It is not linked from anywhere on the site and is hidden from search engines. Share the address only with the people who need it.

### First time: create the password

1. Open `ADMIN-SETUP-KEY.txt` in the site folder on your computer. It holds a one-time setup key. It is never uploaded, and it must stay private.
2. After uploading the site, open `https://devrizgroup.com/admin/`.
3. Enter the setup key and choose a password of at least 10 characters.

That is the only time the key is needed. Whoever opens the page first cannot claim it without the key.

### Day to day

- **Career openings.** "New opening" adds a role. Published roles appear on the careers page within a couple of minutes, with a filter for each department and an entry in the application form. Draft and Closed roles stay in the admin only. Use Closed, not Delete, to keep a record.
- **Newsletters.** "Upload newsletter" takes a PDF (up to 20 MB, or the server's own limit if lower), a title, an issue date and a short summary. Published issues are listed at `/newsroom/newsletter/`, newest first.
- **Change password** is in the top bar. Changing it signs out every other browser.
- Sign-in locks for 15 minutes after five wrong passwords from the same address. An idle session ends after an hour.

### Where the data lives, and why re-uploading is safe

Openings, newsletters and the password are stored in a folder called `dg-data` **beside** `public_html`, not inside it:

```text
domains/devrizgroup.com/
  public_html/      the website (what you upload)
  dg-data/          created by the admin: jobs.json, newsletters.json, admin.json, newsletters/*.pdf
```

Because it is outside `public_html`, nobody can open those files in a browser, and uploading a new build never overwrites them. Do not delete `dg-data` when you clean out `public_html`. If the server does not allow a folder there, the admin falls back to `public_html/dg-data`, which `.htaccess` blocks; in that case take care not to delete it during an upload.

The careers page starts with the eight roles from the old site. They are copied into `dg-data/jobs.json` the first time the careers page or the admin is opened, and from then on the admin is the only place to change them. Editing `src/data/careers.ts` afterwards changes only the fallback list shown when the server cannot be reached.

**Back up `dg-data`** whenever you back up the site. It is the only copy of the openings and the newsletter PDFs.

### If the password is forgotten

1. In Hostinger File Manager, open `dg-data` and delete `admin.json`. Openings and newsletters are untouched.
2. Open `/admin/` and use the setup key again to choose a new password.

To issue a new setup key (for example if the file may have been seen by someone else), run this, then build and upload again:

```bash
npm run admin:key -- --new
```

### Checks after uploading

| Do this | Expect |
|---|---|
| Open `/admin/` for the first time | "Create the admin password" |
| Enter the key and a password | The list of eight starter openings |
| Add an opening, then open `/careers/` | The new role is at the top of Current openings |
| Upload a small PDF, then open `/newsroom/newsletter/` | The issue is listed and the PDF opens |
| Open `/dg-data/admin.json` in the browser | Not found or forbidden |
| Sign out, then open `/api/admin.php?action=jobs` | `{"ok":false,"error":"auth",...}` |

### How it is protected

The password is stored only as a one-way hash. Every change needs a signed-in session and a per-session token, and must come from a page on the site itself. Uploads are accepted only if the file's own content is a PDF, whatever it is named, and are stored outside the web root under a generated name. This was tested locally against PHP 8.4 with 51 checks covering sign-in, lockout, forged requests, upload types and private storage. It has not yet been run on Hostinger itself, so do the checks above on the preview address first.

## What the form handler does and does not do

`api/enquiry.php` checks that the post came from this site, drops submissions that fill the hidden trap field or arrive in under three seconds, limits each address to five submissions in ten minutes, validates the fields, and emails the result as plain text. It stores nothing on the server except a small counter file for the rate limit in the system temp folder.

It does not accept file uploads. Candidates share a link to their resume, as on the old careers page.
