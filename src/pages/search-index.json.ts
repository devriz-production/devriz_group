// Build-time search index, fetched by the search page.
import { pages } from '../lib/pages';

export function GET() {
  const index = pages
    .filter((p) => !p.href.startsWith('/search') && !p.href.startsWith('/sitemap'))
    .map((p) => ({ t: p.title, u: p.href, d: p.description, g: p.group, k: p.keywords ?? '' }));
  return new Response(JSON.stringify(index), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
