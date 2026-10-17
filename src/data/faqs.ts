// Group-level questions, as answered on the current site.
export const groupFaq = [
  {
    q: 'What is Devriz Group?',
    a: 'Devriz Group is a diversified Indian business group headquartered in Noida, Delhi NCR. The group builds and operates companies across healthcare, technology, infrastructure, real estate, FMCG, agriculture, logistics and education, with a focus on disciplined, system-driven growth.',
  },
  {
    q: 'Who is the Chairman of Devriz Group?',
    a: 'Krishna Kumar Singh is the Chairman of Devriz Group. Under his leadership, the group has grown from a healthcare-first foundation into a multi-sector business group operating across northern and eastern India.',
  },
  {
    q: 'Which companies are part of Devriz Group?',
    a: 'Devriz Group companies include Devriz Healthcare, Devriz Professional, Kotil Skin Science, Kotil Aesthetic Academy, Global Alpha Tech, Krishna Construction and Ranjana Devi Construction, among other ventures across healthcare, technology, construction and trading.',
  },
  {
    q: 'Where is Devriz Group located?',
    a: 'The corporate office is at Wave One, Sector 18, Noida (Delhi NCR), Uttar Pradesh, with the registered office in Preet Vihar, New Delhi. The group operates across Delhi, Uttar Pradesh and Bihar.',
  },
  {
    q: 'What sectors does Devriz Group operate in?',
    a: 'Devriz Group operates across healthcare and wellness, skincare and aesthetics, technology and security, infrastructure and real estate, FMCG and consumer products, agriculture and trading, logistics, and education and skilling.',
  },
] as const;

export const faqSchema = (items: readonly { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
});

// The four moves every vertical makes before it grows.
export const growthModel = [
  { icon: 'crosshair', title: 'Define the vertical', text: 'Clear brand role, market purpose, audience and operating scope.' },
  { icon: 'tree-structure', title: 'Build the system', text: 'Standard procedures, reporting, customer journey, team roles and quality control.' },
  { icon: 'chart-line-up', title: 'Track performance', text: 'Numbers, reviews, accountability and improvement loops.' },
  { icon: 'arrows-out', title: 'Scale responsibly', text: 'Expansion only when execution quality can be protected.' },
] as const;
