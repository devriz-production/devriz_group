// Group-level facts. Everything here is taken from the live devrizgroup.com site
// or from the group's own material. Change a fact here and it changes everywhere.

export const site = {
  name: 'Devriz Group',
  url: 'https://devrizgroup.com',
  tagline: 'Built on systems. Grown with discipline.',
  motto: 'स्वास्थ्य · शिक्षा · प्रगति',
  mottoEnglish: 'Health, education, progress',
  description:
    'Devriz Group builds and operates companies across healthcare, technology, infrastructure, consumer products, agriculture, logistics and education.',
  chairman: 'Krishna Kumar Singh',
  phone: '+91 97737 79315',
  phoneHref: 'tel:+919773779315',
  email: 'info@devrizgroup.com',
  gstin: '09AAMCD3433D1ZS',
  updated: '2026-10-14',
  offices: [
    {
      id: 'corporate',
      label: 'Corporate office',
      lines: ['Office No. 17, Gold, 29th Floor', 'Wave One, Sector 18', 'Noida 201303, Uttar Pradesh, India'],
      mapQuery: 'Wave One, Sector 18, Noida 201303',
    },
    {
      id: 'registered',
      label: 'Registered office',
      lines: ['First Floor, Plot No. 8, Shankar Vihar', 'Preet Vihar, New Delhi', 'Delhi 110092, India'],
      mapQuery: 'Shankar Vihar, Preet Vihar, New Delhi 110092',
    },
  ],
  states: ['Delhi', 'Uttar Pradesh', 'Bihar'],
  social: [{ label: 'LinkedIn', icon: 'linkedin-logo', href: 'https://www.linkedin.com/company/devriz-group/' }],
} as const;

// Headline figures as published on the current site.
export const figures = [
  { value: 7, suffix: '', label: 'Business sectors' },
  { value: 20, suffix: '+', label: 'Operating companies' },
  { value: 2000, suffix: '+', label: 'Team members' },
  { value: 3, suffix: '', label: 'States of presence' },
] as const;

export const mainNav = [
  { label: 'About', href: '/about/' },
  { label: 'Businesses', href: '/businesses/', mega: true },
  { label: 'Companies', href: '/companies/' },
  { label: 'Leadership', href: '/leadership/' },
  { label: 'Impact', href: '/impact/' },
  { label: 'Newsroom', href: '/newsroom/' },
  { label: 'Careers', href: '/careers/' },
] as const;

export const utilityNav = [
  { label: 'Vendor registration', href: '/contact/?enquiry=vendor' },
  { label: 'Media enquiries', href: '/contact/?enquiry=media' },
  { label: 'Fraud alert', href: '/careers/recruitment-fraud-alert/' },
  { label: 'Accessibility', href: '/accessibility/' },
] as const;

export const footerNav = [
  {
    heading: 'The group',
    links: [
      { label: 'About Devriz Group', href: '/about/' },
      { label: 'Vision, mission and values', href: '/about/vision-mission-values/' },
      { label: 'Our journey', href: '/about/our-journey/' },
      { label: 'Governance', href: '/about/governance/' },
      { label: 'Leadership', href: '/leadership/' },
      { label: 'Group companies', href: '/companies/' },
    ],
  },
  {
    heading: 'Businesses',
    links: [
      { label: 'Healthcare and wellness', href: '/businesses/healthcare-wellness/' },
      { label: 'Technology and security', href: '/businesses/technology-security/' },
      { label: 'Infrastructure and real estate', href: '/businesses/infrastructure-real-estate/' },
      { label: 'Consumer products and FMCG', href: '/businesses/consumer-fmcg/' },
      { label: 'Agriculture and trading', href: '/businesses/agriculture-trading/' },
      { label: 'Logistics and transport', href: '/businesses/logistics-transport/' },
      { label: 'Education and skilling', href: '/businesses/education-skilling/' },
    ],
  },
  {
    heading: 'Partners and media',
    links: [
      { label: 'Vendor registration', href: '/contact/?enquiry=vendor' },
      { label: 'Partnership enquiries', href: '/contact/?enquiry=partnership' },
      { label: 'Procurement', href: '/procurement/' },
      { label: 'Newsroom', href: '/newsroom/' },
      { label: 'Newsletter', href: '/newsroom/newsletter/' },
      { label: 'Media contact', href: '/contact/?enquiry=media' },
      { label: 'Brand assets', href: '/brand-assets/' },
    ],
  },
  {
    heading: 'Careers and impact',
    links: [
      { label: 'Working at Devriz', href: '/careers/' },
      { label: 'Current openings', href: '/careers/#openings' },
      { label: 'Recruitment fraud alert', href: '/careers/recruitment-fraud-alert/' },
      { label: 'Impact overview', href: '/impact/' },
      { label: 'Animal welfare', href: '/impact/?category=animal-welfare' },
      { label: 'Skilling and employment', href: '/impact/?category=skilling' },
    ],
  },
  {
    heading: 'Policies',
    links: [
      { label: 'Corporate policies', href: '/policies/' },
      { label: 'Code of conduct', href: '/policies/code-of-conduct/' },
      { label: 'Supplier code of conduct', href: '/policies/supplier-code-of-conduct/' },
      { label: 'Grievance redressal', href: '/policies/grievance-redressal/' },
    ],
  },
] as const;

export const legalNav = [
  { label: 'Accessibility statement', href: '/accessibility/' },
  { label: 'Disclaimer', href: '/disclaimer/' },
  { label: 'Privacy policy', href: '/privacy-policy/' },
  { label: 'Terms and conditions', href: '/terms-and-conditions/' },
  { label: 'Cookie policy', href: '/cookie-policy/' },
  { label: 'Sitemap', href: '/sitemap/' },
  { label: 'Feedback', href: '/contact/?enquiry=feedback' },
] as const;

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' }).format(
    new Date(iso + 'T12:00:00+05:30'),
  );
