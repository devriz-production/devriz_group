// Leadership as shown on the current homepage. Portrait files live in
// src/assets/people/<image>.* and must be real photographs supplied by the group.

export type Person = {
  slug: string;
  name: string;
  honorific: string;
  role: string;
  org: string;
  note?: string;
  quote: string;
  bio: string;
  image: string;
};

export const chairman: Person = {
  slug: 'krishna-kumar-singh',
  name: 'Krishna Kumar Singh',
  honorific: 'Mr.',
  role: 'Chairman',
  org: 'Devriz Group',
  quote: 'True growth is built on structure, trust, and long-term thinking.',
  bio: 'Krishna Kumar Singh leads Devriz Group with a practical and structured approach. His focus is on building reliable teams, strong systems and scalable businesses across healthcare, infrastructure, agriculture, logistics, technology and social impact.',
  image: 'krishna-kumar-singh',
};

export const leaders: Person[] = [
  {
    slug: 'dev-singh',
    name: 'Dev Singh',
    honorific: 'Mr.',
    role: 'Vice Chairman',
    org: 'Devriz Group',
    quote: 'Every vertical we build must run on systems and accountability. Scale follows discipline, never the other way around.',
    bio: 'Dev Singh drives the group’s systems-first approach to building companies: clear roles, department-level targets, leadership ownership and operations that scale beyond individuals.',
    image: 'dev-singh',
  },
  {
    slug: 'amy-aliya',
    name: 'Amy Aliya',
    honorific: 'Mrs.',
    role: 'Co-Founder',
    org: 'Devriz Healthcare',
    quote: 'Healthcare earns trust one patient at a time. Quality and compassion have to work together.',
    bio: 'Amy Aliya contributes to operational development, healthcare innovation and brand-led service execution across the group’s healthcare businesses.',
    image: 'amy-aliya',
  },
  {
    slug: 'rahul-mayank',
    name: 'Rahul Mayank',
    honorific: 'Mr.',
    role: 'Partner',
    org: 'Devriz Healthcare',
    quote: 'Consistent, reliable service delivery is what turns a first visit into a lifelong relationship.',
    bio: 'Rahul Mayank is a partner in Devriz Healthcare, where he works on the consistency of service delivery across consultation and care.',
    image: 'rahul-mayank',
  },
  {
    slug: 'brajesh-varman',
    name: 'Brajesh Varman',
    honorific: 'Mr.',
    role: 'Investor and Partner',
    org: 'Devriz Group',
    note: 'Former Joint Commissioner, Delhi Police',
    quote: 'Institutions are built on integrity. I back businesses that treat governance as seriously as growth.',
    bio: 'Brajesh Varman is an investor and partner in the group. A former Joint Commissioner of Delhi Police, he supports the group on governance, risk oversight and accountability.',
    image: 'brajesh-varman',
  },
];

export const chairmanMessage = {
  heading: 'True growth is built on structure, trust and long-term thinking.',
  paragraphs: [
    'At Devriz Group, our direction is simple: build systems that deliver consistent value. Across every business, we focus on reliability, discipline and customer trust.',
    'We focus on disciplined execution, ethical leadership, and systems that create long-term value across every business in the group.',
    'Each company runs its own operations and answers to a common standard for governance, reporting and quality. That is how we intend to grow: deliberately, and in businesses we understand.',
    'Our goal is not to be the loudest. Our goal is to be the most dependable.',
  ],
};

export const leadershipValues = [
  { title: 'Trust first', text: 'Building reliable relationships with customers, teams and partners.' },
  { title: 'System driven', text: 'Creating repeatable systems for stable and scalable business growth.' },
  { title: 'Long-term thinking', text: 'Focusing on sustainable growth instead of short-term noise.' },
];

export const chairmansOffice = [
  { title: 'Vision and direction', text: 'Defines the group-level vision, mission and long-term roadmap, so growth stays intentional.' },
  { title: 'Investments and partnerships', text: 'Reviews and approves major investments, partnerships and strategic initiatives.' },
  { title: 'Leadership reviews', text: 'Tracks the performance of senior leadership across companies through measurable outcomes.' },
  { title: 'Governance and compliance', text: 'Ensures ethical governance, process discipline and compliance across all verticals.' },
  { title: 'Succession and development', text: 'Builds leadership continuity through succession planning and capability building.' },
  { title: 'Oversight with autonomy', text: 'Clarity at the top, ownership at every level, and outcomes that are measured.' },
];

export const governancePrinciples = [
  { title: 'Transparency', text: 'Clear decisions, clear ownership, clear reporting.' },
  { title: 'Accountability', text: 'Targets are measured. Outcomes are reviewed.' },
  { title: 'Data-led reviews', text: 'Strategic decisions are guided by evidence, not assumptions.' },
  { title: 'Ethics first', text: 'Zero tolerance for shortcuts that damage trust.' },
  { title: 'Long-term sustainability', text: 'Durable systems over short-term optics.' },
];
