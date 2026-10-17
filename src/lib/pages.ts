// One list of every page on the site. Feeds the search index and the sitemap page,
// so a new page added here is searchable and listed without further work.
import { sectors } from '../data/sectors';
import { companies } from '../data/companies';
import { news } from '../data/news';
import { roles } from '../data/careers';
import { leaders, chairman } from '../data/people';
import { policies } from './policies';

export type PageEntry = {
  title: string;
  href: string;
  description: string;
  group: string;
  keywords?: string;
};

const fixed: PageEntry[] = [
  { group: 'The group', title: 'Home', href: '/', description: 'Devriz Group builds and operates companies across seven sectors in India.' },
  { group: 'The group', title: 'About Devriz Group', href: '/about/', description: 'Who we are, how we work and where we operate.', keywords: 'who we are philosophy presence states offices' },
  { group: 'The group', title: 'Vision, mission and values', href: '/about/vision-mission-values/', description: 'What the group is building toward and the values it applies.', keywords: 'purpose principles core values' },
  { group: 'The group', title: 'Our journey', href: '/about/our-journey/', description: 'From a healthcare-first foundation in 2018 to a multi-sector group.', keywords: 'history milestones timeline 2018' },
  { group: 'The group', title: 'Governance', href: '/about/governance/', description: 'The Chairman’s Office, governance principles and information for partners.', keywords: 'investors partners compliance oversight board' },
  { group: 'The group', title: 'Leadership', href: '/leadership/', description: 'The Chairman and the leadership of the group.', keywords: [chairman, ...leaders].map((p) => p.name).join(' ') },
  { group: 'The group', title: 'Krishna Kumar Singh, Chairman', href: '/chairman-krishna-kumar-singh/', description: 'Profile and message of the Chairman of Devriz Group.', keywords: 'chairman message profile' },
  { group: 'Businesses', title: 'Businesses', href: '/businesses/', description: 'The seven sectors Devriz Group operates in.', keywords: 'sectors verticals industries' },
  { group: 'Companies', title: 'Group companies', href: '/companies/', description: 'Directory of Devriz Group companies, by sector.', keywords: 'directory list subsidiaries group structure' },
  { group: 'Impact', title: 'Impact', href: '/impact/', description: 'Community programmes, animal welfare and skilling.', keywords: 'csr trust gaushala community animal welfare skilling employment environment' },
  { group: 'Newsroom', title: 'Newsroom', href: '/newsroom/', description: 'Press releases, group updates and media coverage.', keywords: 'news press media coverage journalists' },
  { group: 'Newsroom', title: 'Newsletter', href: '/newsroom/newsletter/', description: 'Issues of the Devriz Group newsletter, as PDFs.', keywords: 'newsletter issues updates pdf' },
  { group: 'Newsroom', title: 'Brand assets', href: '/brand-assets/', description: 'Logos, colours and boilerplate text for press and partners.', keywords: 'logo download press kit colours' },
  { group: 'Careers', title: 'Careers', href: '/careers/', description: 'Open roles, how we hire and how to apply.', keywords: 'jobs vacancies openings apply hiring ' + roles.map((r) => r.title).join(' ') },
  { group: 'Partners', title: 'Contact', href: '/contact/', description: 'Send an enquiry and find office addresses.', keywords: 'address phone email offices noida delhi enquiry' },
  { group: 'Partners', title: 'Vendor registration', href: '/contact/?enquiry=vendor', description: 'Register as a supplier or contractor.', keywords: 'supplier contractor vendor register' },
  { group: 'Partners', title: 'Partnership enquiries', href: '/contact/?enquiry=partnership', description: 'Propose a business partnership or collaboration.', keywords: 'partner invest collaborate' },
  { group: 'Partners', title: 'Media enquiries', href: '/contact/?enquiry=media', description: 'For journalists and publications.', keywords: 'press journalist interview' },
  { group: 'Partners', title: 'Procurement', href: '/procurement/', description: 'What the group buys and how suppliers are onboarded.', keywords: 'suppliers purchasing tenders vendors' },
  { group: 'Policies', title: 'Corporate policies', href: '/policies/', description: 'All Devriz Group policy documents.', keywords: 'policy documents' },
  { group: 'Help', title: 'Sitemap', href: '/sitemap/', description: 'Every page on this website.' },
  { group: 'Help', title: 'Search', href: '/search/', description: 'Search this website.' },
  { group: 'Help', title: 'हिन्दी में परिचय', href: '/hi/', description: 'Devriz Group overview in Hindi.', keywords: 'hindi overview' },
];

export const pages: PageEntry[] = [
  ...fixed,
  ...sectors.map((s) => ({
    group: 'Businesses',
    title: s.name,
    href: `/businesses/${s.slug}/`,
    description: s.summary,
    keywords: s.capabilities.map((c) => c.title).join(' '),
  })),
  ...companies.map((c) => ({
    group: 'Companies',
    title: c.name,
    href: `/companies/${c.slug}/`,
    description: c.summary,
    keywords: `${c.legalName} ${c.focus.join(' ')}`,
  })),
  ...news.map((n) => ({ group: 'Newsroom', title: n.title, href: `/newsroom/${n.slug}/`, description: n.summary })),
  ...policies.map((p) => ({ group: p.group === 'Careers' ? 'Careers' : 'Policies', title: p.title, href: p.href, description: p.description })),
];

export const pageGroups = ['The group', 'Businesses', 'Companies', 'Impact', 'Newsroom', 'Careers', 'Partners', 'Policies', 'Help'];
