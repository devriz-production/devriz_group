import type { MarkdownInstance } from 'astro';

type Front = { title: string; description: string; summary: string; updated: string };

const files = import.meta.glob<MarkdownInstance<Front>>('../content/policies/*.md', { eager: true });

// Where each document lives. Root-level slugs match the links already in the live footer.
const routes: Record<string, { href: string; group: 'Website' | 'Conduct' | 'Careers' }> = {
  'privacy-policy': { href: '/privacy-policy/', group: 'Website' },
  'terms-and-conditions': { href: '/terms-and-conditions/', group: 'Website' },
  'cookie-policy': { href: '/cookie-policy/', group: 'Website' },
  disclaimer: { href: '/disclaimer/', group: 'Website' },
  accessibility: { href: '/accessibility/', group: 'Website' },
  'code-of-conduct': { href: '/policies/code-of-conduct/', group: 'Conduct' },
  'supplier-code-of-conduct': { href: '/policies/supplier-code-of-conduct/', group: 'Conduct' },
  'grievance-redressal': { href: '/policies/grievance-redressal/', group: 'Conduct' },
  'recruitment-fraud-alert': { href: '/careers/recruitment-fraud-alert/', group: 'Careers' },
};

export const policies = Object.entries(files)
  .map(([path, mod]) => {
    const slug = path.split('/').pop()!.replace(/\.md$/, '');
    return { slug, ...routes[slug], ...mod.frontmatter, Content: mod.Content, headings: mod.getHeadings() };
  })
  .filter((p) => p.href);

export const getPolicy = (slug: string) => policies.find((p) => p.slug === slug)!;
export const rootPolicies = policies.filter((p) => p.href.split('/').filter(Boolean).length === 1);
export const nestedPolicies = policies.filter((p) => p.href.startsWith('/policies/'));
