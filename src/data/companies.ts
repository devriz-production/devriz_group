// Group companies. Names and entity types follow the group's own published
// structure; descriptions are built only from what the live site states.
// `needsDetail` marks entries where the group has published a name but no
// description yet, so nothing has been invented for them.

export type Company = {
  slug: string;
  name: string;
  legalName: string;
  sector: string;
  entity: 'Private limited company' | 'Proprietorship' | 'Brand' | 'Group company';
  summary: string;
  description: string[];
  focus: string[];
  location?: string;
  website?: { label: string; href: string };
  featured?: boolean;
  needsDetail?: boolean;
};

export const companies: Company[] = [
  {
    slug: 'devriz-healthcare',
    name: 'Devriz Healthcare',
    legalName: 'Devriz Healthcare Private Limited',
    sector: 'healthcare-wellness',
    entity: 'Private limited company',
    summary: 'A doctor-led consultation platform for skin, hair and body concerns.',
    description: [
      'Devriz Healthcare is a doctor-led consultation platform focused on skin, hair and body concerns. It helps customers understand their concern through expert guidance before they move toward suitable care.',
      'The model is consultation first. A concern is assessed by a professional, the customer receives a personalised recommendation, and follow-up continues after treatment begins. It is the company the group grew from, and it sets the standard the other healthcare businesses follow.',
    ],
    focus: ['Skin, hair and body consultation', 'Doctor-led diagnosis', 'Personalised concern assessment', 'Digital consultation model'],
    location: 'Noida, Delhi NCR',
    website: { label: 'devrizhealthcare.com', href: 'https://devrizhealthcare.com/' },
    featured: true,
  },
  {
    slug: 'kotil-skin-science',
    name: 'Kotil Skin Science',
    legalName: 'Kotil Skin Science Private Limited',
    sector: 'healthcare-wellness',
    entity: 'Private limited company',
    summary: 'An aesthetic clinic chain for advanced skin, beauty and cosmetic care.',
    description: [
      'Kotil Skin Science is the group’s aesthetic clinic chain, focused on advanced skin, beauty and cosmetic care. It serves customers who need in-person aesthetic solutions beyond basic care.',
      'Clinics in Delhi and Noida offer aesthetic skin treatments and clinic-based procedures under expert cosmetology care. Kotil works alongside Devriz Healthcare, so a customer can move from an online consultation to clinic treatment without starting over.',
    ],
    focus: ['Aesthetic skin treatments', 'Clinic-based procedures', 'Expert cosmetology care', 'Clinics in Delhi and Noida'],
    location: 'Delhi and Noida',
    website: { label: 'kotilskinscience.com', href: 'https://kotilskinscience.com/' },
    featured: true,
  },
  {
    slug: 'devriz-professional',
    name: 'Devriz Professional',
    legalName: 'Devriz Professional',
    sector: 'healthcare-wellness',
    entity: 'Brand',
    summary: 'Professional skincare products with trust-led positioning.',
    description: [
      'Devriz Professional is the product arm of the healthcare business. It supports the group’s consultation and clinic work with a professional skincare range.',
      'The brand is built around dermatology-focused presentation and category-specific product growth, so that what a customer is recommended in consultation is available to them as a product they can rely on.',
    ],
    focus: ['Professional skincare products', 'Dermatology-focused positioning', 'Category-specific product development'],
    website: { label: 'devrizprofessional.com', href: 'https://devrizprofessional.com/' },
  },
  {
    slug: 'global-alpha-tech',
    name: 'Global Alpha Tech Security',
    legalName: 'Global Alpha Tech Security Private Limited',
    sector: 'technology-security',
    entity: 'Private limited company',
    summary: 'IT infrastructure, digital systems and security solutions.',
    description: [
      'Global Alpha Tech Security is the group’s technology company. It supports businesses with secure, scalable IT solutions: websites and applications, cloud-ready systems, hosting support, managed technology workflows and digital growth systems.',
      'Its work covers the full life of a platform, from requirement analysis and infrastructure planning to implementation, monitoring and long-term support. It serves outside clients and supports operational efficiency across Devriz Group companies.',
    ],
    focus: [
      'Website and application development',
      'Cloud infrastructure and hosting support',
      'Cybersecurity approach',
      'Managed data workflows and backup readiness',
      'Surveillance and security solutions',
    ],
    location: 'Noida, Delhi NCR',
    website: { label: 'globalalphatech.com', href: 'https://globalalphatech.com/' },
    featured: true,
  },
  {
    slug: 'segurana-safety-security',
    name: 'Devriz Segurana Safety & Security',
    legalName: 'Devriz Segurana Safety & Security',
    sector: 'technology-security',
    entity: 'Group company',
    summary: 'Private security and safety services.',
    description: [
      'Devriz Segurana Safety & Security provides private security and safety services, including security manpower. It is the physical counterpart to the group’s digital security work.',
      'Like every Devriz company, it runs on defined roles, standard operating procedures and regular reporting, which matters most in a business where reliability is the product.',
    ],
    focus: ['Security manpower', 'Safety services', 'Site and facility coverage'],
  },
  {
    slug: 'devriz-builder-construction',
    name: 'Devriz Builder Construction',
    legalName: 'Devriz Builder Construction Private Limited',
    sector: 'infrastructure-real-estate',
    entity: 'Private limited company',
    summary: 'Residential and commercial construction services.',
    description: [
      'Devriz Builder Construction takes on residential and commercial construction. It is one of three construction companies in the group’s infrastructure and real estate business.',
      'Projects are run through structured coordination: clear scope, documentation, vendor management and site reporting at each stage.',
    ],
    focus: ['Residential construction', 'Commercial construction', 'Project coordination and documentation'],
  },
  {
    slug: 'ranjana-devi-construction',
    name: 'Ranjana Devi Construction',
    legalName: 'Ranjana Devi Construction Private Limited',
    sector: 'infrastructure-real-estate',
    entity: 'Private limited company',
    summary: 'Civil construction and infrastructure development.',
    description: [
      'Ranjana Devi Construction works on civil construction and infrastructure development. Its delivery is structured to match the group’s approach to scalable project execution.',
      'The company operates with its own leadership and reports to the group standard for governance, quality and accountability.',
    ],
    focus: ['Civil construction', 'Infrastructure development', 'Structured project delivery'],
  },
  {
    slug: 'krishna-construction',
    name: 'Krishna Construction',
    legalName: 'Krishna Construction Private Limited',
    sector: 'infrastructure-real-estate',
    entity: 'Private limited company',
    summary: 'Execution-led construction and infrastructure development.',
    description: [
      'Krishna Construction is an execution-led construction and infrastructure company. It adds on-ground building capability to the group’s infrastructure and real estate business.',
      'The company follows the group’s operating standard: defined ownership for each stage of a project, and progress that is measured rather than assumed.',
    ],
    focus: ['Construction', 'Infrastructure development', 'On-site execution'],
  },
  {
    slug: 'pdr-agro',
    name: 'PDR Agro',
    legalName: 'PDR Agro Private Limited',
    sector: 'consumer-fmcg',
    entity: 'Private limited company',
    summary: 'Agro-based products and operations.',
    description: [
      'PDR Agro works on agro-based products and operations. It sits where the group’s agriculture and consumer businesses meet, turning produce into products.',
      'The company runs to the same reporting and quality standard as the rest of the group.',
    ],
    focus: ['Agro-based products', 'Agro operations', 'Supply coordination'],
  },
  {
    slug: 'gramin-industries',
    name: 'Gramin Industries',
    legalName: 'Gramin Industries',
    sector: 'consumer-fmcg',
    entity: 'Group company',
    summary: 'Agriculture-based activities and rural economic development.',
    description: [
      'Gramin Industries is one of the group’s agro-focused companies. It is involved in agriculture-based activities and rural economic development, alongside PDR Agro.',
      'It operates with its own management and answers to the group standard for governance, reporting and quality.',
    ],
    focus: ['Agriculture-based products', 'Rural economic development'],
    needsDetail: true,
  },
  {
    slug: 'devriz-fashion-lifestyle',
    name: 'Devriz Fashion Lifestyle',
    legalName: 'Devriz Fashion Lifestyle Private Limited',
    sector: 'consumer-fmcg',
    entity: 'Private limited company',
    summary: 'Beauty, lifestyle and personal care.',
    description: [
      'Devriz Fashion Lifestyle represents the group’s focus on beauty, lifestyle and personal care. It connects wellness with everyday needs through quality-driven care and grooming solutions.',
      'The company carries the healthcare business’s wellness-oriented approach into products for the modern consumer.',
    ],
    focus: ['Beauty and lifestyle care', 'Personal care products', 'Wellness-oriented approach', 'Modern consumer solutions'],
  },
  {
    slug: 'khanacap-foods',
    name: 'Khanacap Foods',
    legalName: 'Khanacap Foods (Proprietorship)',
    sector: 'agriculture-trading',
    entity: 'Proprietorship',
    summary: 'Fodder trading and crop-related business.',
    description: [
      'Khanacap Foods works in fodder trading and crop-related business. With JNS Food Trading, it forms the group’s fodder trading and food grain distribution segment.',
      'The aim of both companies is to support agricultural supply chains and improve market access for what is grown.',
    ],
    focus: ['Fodder trading', 'Crop-related business', 'Agricultural supply chains'],
    needsDetail: true,
  },
  {
    slug: 'jns-food-trading',
    name: 'JNS Food Trading',
    legalName: 'JNS Food Trading (Proprietorship)',
    sector: 'agriculture-trading',
    entity: 'Proprietorship',
    summary: 'Food commodities, fodder trading and food grain distribution.',
    description: [
      'JNS Food Trading trades in food commodities, including fodder and food grains. It is the commercial arm of the group’s agriculture and trading business.',
      'Trading depends on reliable supply and honest dealing. The company applies the group’s standard for coordination, records and accountability to both.',
    ],
    focus: ['Food commodities', 'Fodder trading', 'Food grain distribution'],
  },
  {
    slug: 'jns-land-agriculture',
    name: 'JNS Land & Agriculture',
    legalName: 'JNS Land & Agriculture (Proprietorship)',
    sector: 'agriculture-trading',
    entity: 'Proprietorship',
    summary: 'Agricultural land and produce management.',
    description: [
      'JNS Land & Agriculture manages agricultural land and the produce grown on it. It is a long-horizon business, held and run with patience.',
      'It works closely with JNS Food Trading and PDR Agro, which take produce on to market and into products.',
    ],
    focus: ['Agricultural land management', 'Produce management'],
  },
  {
    slug: 'furniture-tree-farming',
    name: 'Furniture & Tree Farming',
    legalName: 'Furniture & Tree Farming (Proprietorship)',
    sector: 'agriculture-trading',
    entity: 'Proprietorship',
    summary: 'Sustainable forestry and furniture operations.',
    description: [
      'Furniture & Tree Farming combines sustainable forestry with furniture operations. Trees are a crop measured in years, which suits a group that plans for the long term.',
      'The business is run with the same reporting and accountability as every other company in the group.',
    ],
    focus: ['Sustainable forestry', 'Tree farming', 'Furniture operations'],
  },
  {
    slug: 'autodell-transport',
    name: 'Autodell Transport',
    legalName: 'Autodell Transport Service',
    sector: 'logistics-transport',
    entity: 'Group company',
    summary: 'Logistics and transportation services across India.',
    description: [
      'Autodell Transport provides logistics and transportation services across India, supporting supply chain and movement requirements for multiple industries.',
      'Its operations follow standard procedures for dispatch, tracking and reporting, with regular reviews to find and remove bottlenecks.',
    ],
    focus: ['Transportation', 'Logistics services', 'Dispatch and tracking'],
  },
  {
    slug: 'kotil-aesthetic-academy',
    name: 'Kotil Aesthetic Academy',
    legalName: 'Kotil Aesthetic Academy (Proprietorship)',
    sector: 'education-skilling',
    entity: 'Proprietorship',
    summary: 'Aesthetic and skincare education with a structured, hands-on approach.',
    description: [
      'Kotil Aesthetic Academy offers aesthetic and skincare education built on practical exposure. Students learn through structured coursework and hands-on training, with skills that match what clinics need.',
      'The academy grew out of the group’s own need for skilled aesthetic professionals. It now trains people for the wider industry as well, with certification pathways and a career-oriented training model.',
    ],
    focus: ['Practical aesthetic training', 'Industry-aligned curriculum', 'Professional certification pathways', 'Career-oriented courses'],
    location: 'Preet Vihar, Delhi',
    website: { label: 'kotilaestheticacademy.com', href: 'https://kotilaestheticacademy.com/' },
  },
];

export const getCompany = (slug: string) => companies.find((c) => c.slug === slug)!;
export const companiesIn = (sector: string) => companies.filter((c) => c.sector === sector);

// Trusts associated with the group. They are not commercial companies and are
// presented under Impact rather than in the company directory.
export const trusts = [
  {
    slug: 'environment-human-welfare-trust',
    name: 'Environment & Human Welfare Trust',
    category: 'community',
    summary: 'A charitable trust engaged in social and community-focused programmes.',
  },
  {
    slug: 'nandani-gaushala',
    name: 'Nandani Gaushala',
    category: 'animal-welfare',
    summary: 'Sustainable gaushala operations and animal care.',
  },
  {
    slug: 'pehlagarh-gaushala',
    name: 'Pehlagarh Gaushala',
    category: 'animal-welfare',
    summary: 'Cattle welfare and care initiatives.',
  },
] as const;
