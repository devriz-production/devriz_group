// Newsroom content. Dates and facts come from the published release and the
// article already on the live site. Coverage links point at the original outlets.

export type NewsItem = {
  slug: string;
  category: 'press-release' | 'group-update';
  title: string;
  date: string;
  summary: string;
  dateline?: string;
  body: { heading?: string; paragraphs?: string[]; list?: string[] }[];
};

export const categories = [
  { id: 'press-release', label: 'Press releases' },
  { id: 'group-update', label: 'Group updates' },
  { id: 'media-coverage', label: 'Media coverage' },
] as const;

export const news: NewsItem[] = [
  {
    slug: 'vision-mission-multi-sector-growth-journey',
    category: 'group-update',
    title: 'Vision, mission and the multi-sector growth journey',
    date: '2025-12-30',
    summary:
      'How Devriz Group grew from a healthcare-first foundation into a diversified group, and the principles that guide each expansion.',
    body: [
      {
        paragraphs: [
          'Sustainable growth is no longer driven by scale alone. It is driven by vision, execution discipline and long-term intent. Devriz Group is built on these principles, operating across several sectors with a single strategic direction.',
          'Devriz Group is not a single-industry company. It is a structured group of businesses operating under a shared leadership framework, ethical foundation and growth philosophy. Each vertical is independent in execution and aligned to a common vision and governance structure.',
        ],
      },
      {
        heading: 'Why a multi-sector model',
        list: [
          'It reduces dependence on a single industry cycle.',
          'It encourages innovation across functions.',
          'It builds long-term financial and operational stability.',
          'It creates impact across healthcare, education, technology and lifestyle.',
        ],
      },
      {
        heading: 'Vision',
        paragraphs: [
          'To build sustainable, scalable and ethically governed businesses that deliver long-term value to customers, partners, employees and society.',
          'The vision goes beyond revenue. It reflects a commitment to responsible business practices, quality-driven service, innovation grounded in real needs, and long-term thinking over short-term gains.',
        ],
      },
      {
        heading: 'Mission',
        paragraphs: ['Vision defines direction. Mission defines action. The mission of Devriz Group is execution excellence: turning ideas into measurable outcomes.'],
        list: [
          'Deliver high-quality products and services across all verticals.',
          'Build systems that support operational efficiency and compliance.',
          'Invest in people, training and leadership development.',
          'Adopt technology as a growth enabler, not a shortcut.',
        ],
      },
      {
        heading: 'The growth journey',
        paragraphs: [
          'Foundation and sector expertise. The group first built deep expertise in healthcare, skincare and aesthetic services, with the emphasis on service quality, customer trust, operational systems and regulatory compliance.',
          'Brand and capability expansion. With strong foundations in place, the group expanded into advanced aesthetic services, professional training and education, and technology-driven business solutions. Each new vertical addressed a clear market gap and built on existing strengths.',
          'Multi-sector integration. Today the group operates as a cohesive ecosystem, where businesses benefit from shared governance, strategic oversight and a common leadership philosophy.',
        ],
      },
      {
        heading: 'The road ahead',
        paragraphs: [
          'The roadmap is guided by the same principles that shaped the journey: expansion into aligned sectors, continuous improvement of existing verticals, investment in technology and people, and stronger governance and compliance.',
          'Growth will remain measured and purpose-driven, so that expansion never compromises quality or ethics.',
        ],
      },
    ],
  },
  {
    slug: 'devriz-group-strengthens-multi-sector-presence',
    category: 'press-release',
    title: 'Devriz Group strengthens its multi-sector presence across India',
    date: '2025-12-22',
    dateline: 'India',
    summary:
      'The privately held group sets out its portfolio across healthcare, technology, construction, logistics, agriculture, security services and social welfare.',
    body: [
      {
        paragraphs: [
          'Devriz Group, a privately held Indian business group, continues to strengthen its presence across multiple sectors through a diversified portfolio of companies in healthcare, technology, infrastructure, logistics, agriculture, fodder trading, security services and social welfare.',
          'Founded with a vision to build sustainable, scalable and socially responsible enterprises, the group has developed a multi-sector ecosystem that addresses both commercial objectives and community needs. It operates primarily within the Indian market and manages its businesses through independent legal entities aligned under a common strategic and compliance framework.',
        ],
      },
      {
        heading: 'Healthcare, wellness and education',
        paragraphs: [
          'In healthcare and wellness, Devriz Healthcare operates in skincare, wellness and healthcare-related solutions. Kotil Skin Science provides dermatology and aesthetic treatment services, and Kotil Aesthetic Academy offers professional training in aesthetic sciences. Together they reflect the group’s philosophy of combining medical science, education and patient-centric care.',
        ],
      },
      {
        heading: 'Technology, logistics and security',
        paragraphs: [
          'Global Alpha Tech delivers technology-driven solutions and digital services, supporting businesses with modern, scalable and process-oriented technology infrastructure.',
          'Autodell provides logistics and transportation services across India, supporting supply chain and movement requirements for multiple industries. Segurana Safety & Security provides private security and safety services.',
        ],
      },
      {
        heading: 'Construction and infrastructure',
        paragraphs: [
          'Construction and infrastructure form another operational pillar. Through Devriz Builder Construction, Krishna Construction and Ranjana Devi Construction, the group is engaged in civil construction and infrastructure-related projects. These companies operate as independent entities while adhering to standardised operational practices and regulatory compliance norms.',
        ],
      },
      {
        heading: 'Agriculture, trading and lifestyle',
        paragraphs: [
          'The group has expanded into agriculture, fodder trading and rural economy initiatives through Gramin Industries, PDR Agro and JNS Land & Agriculture, which are involved in agriculture-based activities and rural economic development.',
          'In fodder trading and food grain distribution, JNS Food Trading and Khanacap Foods support agricultural supply chains and improve market access. Devriz Fashion Lifestyle represents the group in fashion and lifestyle.',
        ],
      },
      {
        heading: 'Social welfare',
        paragraphs: [
          'Beyond its commercial operations, the group is involved in social welfare through the Environment & Human Welfare Trust, a charitable trust engaged in social and community-focused programmes. It also supports animal welfare through Nandani Gaushala and Pehlagarh Gaushala, which work toward cattle protection and animal care.',
          'Devriz Group plans to continue strengthening its existing businesses while exploring new opportunities aligned with its multi-sector strategy and long-term vision.',
        ],
      },
    ],
  },
];

export const getNews = (slug: string) => news.find((n) => n.slug === slug)!;

const story = 'devriz-group-strengthens-its-multi-sector-presence-across-india';

// Outlets that carried the December 2025 release. `logo` is a file in src/assets/press/.
export const coverage = [
  { outlet: 'News18 Nation', logo: 'news-18-nation', href: `https://news18nation.com/${story}` },
  { outlet: 'Business Live Now', logo: 'business-live-now', href: `https://businesslivenow.com/${story}` },
  { outlet: 'Startup24 Live', logo: 'startup24-live', href: `https://startup24live.com/${story}` },
  { outlet: 'RV Rising News', logo: 'rv-rising-news', href: `https://rvrising.com/news/agency-news/${story}/` },
  { outlet: 'News Vachan', logo: 'news-vachan', href: `https://newsvachan.com/${story}` },
  { outlet: 'Newsport Live', logo: 'news-sport', href: `https://newsportlive.com/${story}` },
  { outlet: 'News On Board', logo: 'news-on-board', href: `https://newsonboard.in/${story}` },
  { outlet: 'News Motion', logo: 'news-motion', href: `https://newsmotion.in/${story}` },
  { outlet: 'Think of India', logo: 'think-of-india', href: `https://thinkof-india.com/${story}` },
  { outlet: 'First Look Times', logo: 'first-look-times', href: `https://firstlooktimes.com/${story}` },
  { outlet: 'Desh Duniya Times', logo: 'desh-duniya-times', href: `https://deshduniyatimes.com/${story}` },
  { outlet: 'Attention India', logo: 'attention-india-news', href: `https://attentionindia.com/${story}` },
  { outlet: 'Attention Mumbai', logo: 'attention-mumbai', href: `https://attentionmumbai.com/${story}` },
  { outlet: 'Attention Pedia', logo: 'attention-pedia', href: `https://attentionpedia.com/agency-news/${story}/` },
  { outlet: 'US Times World', logo: 'us-times-world', href: `https://usatimesworld.com/${story}` },
  { outlet: 'Yoursvia', logo: 'yorsvia', href: `https://yoursvia.com/${story}` },
  { outlet: 'Forbes of India', logo: 'forbes-of-india', href: `https://forbesofindia.com/${story}` },
  { outlet: 'Enter10 India', logo: 'enter-10', href: `https://enter10india.com/${story}` },
  { outlet: 'Filmyapa', logo: 'filmyapa', href: `https://filmyapa.com/${story}` },
  { outlet: 'Filmy Chakkar', logo: 'filmi-chakkar', href: `https://filmychakkar.com/${story}` },
  { outlet: 'Filmy Buddy', logo: 'filmi-buddy', href: `https://filmybuddy.in/${story}` },
] as const;
