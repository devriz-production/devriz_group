// Hiring profiles and careers copy, carried over from the current careers page.

export type Role = {
  slug: string;
  title: string;
  department: string;
  summary: string;
  points: string[];
  type?: string;
  experience?: string;
  location?: string;
  fit?: string;
};

export const roles: Role[] = [
  {
    slug: 'sales-executive',
    title: 'Sales Executive / Telecaller',
    department: 'Sales',
    summary: 'Handle leads, explain services clearly, follow up properly and convert enquiries into sales or bookings.',
    points: [
      'Handle inbound and outbound leads from calls, WhatsApp, ads, the website and the CRM.',
      'Explain services, consultations, academy programmes or products based on the requirement.',
      'Maintain a daily calling sheet, follow-up status and conversion report.',
    ],
    type: 'Full-time',
    experience: '0-2 years',
    location: 'Delhi NCR / Noida',
    fit: 'Good communication in Hindi, a target mindset, CRM discipline, follow-up strength and basic computer knowledge.',
  },
  {
    slug: 'skin-counselor',
    title: 'Skin Counselor / Clinic Counselor',
    department: 'Healthcare and clinic',
    summary: 'Understand customer concerns, guide them through the consultation or clinic process, and maintain follow-up.',
    points: [
      'Understand the client’s concern and manage the consultation flow.',
      'Coordinate clinic appointments and treatment schedules.',
      'Keep follow-ups on time and recorded.',
    ],
    type: 'Full-time',
    location: 'Delhi NCR / Noida',
    fit: 'Healthcare, clinic, salon or BPO experience is preferred.',
  },
  {
    slug: 'digital-marketing-executive',
    title: 'Digital Marketing Executive',
    department: 'Marketing',
    summary: 'Plan and coordinate campaigns, social media, content and website updates for group companies.',
    points: [
      'Plan and coordinate campaigns for group companies.',
      'Work with the design, video, paid ads, SEO and website teams.',
      'Track content calendars, campaign output, leads and performance reports.',
    ],
    type: 'Full-time',
    experience: '1-3 years',
    location: 'Delhi NCR / Noida',
    fit: 'An understanding of social media, content planning, basic SEO, campaign coordination and reporting.',
  },
  {
    slug: 'performance-marketing-executive',
    title: 'PPC / Performance Marketing Executive',
    department: 'Marketing',
    summary: 'Run Meta Ads and Google Ads with a focus on lead quality, conversion cost and campaign testing.',
    points: [
      'Run lead generation and conversion campaigns.',
      'Track cost per lead, cost per acquisition, click-through rate, lead quality and return.',
      'Test creatives, audiences, funnels and landing pages.',
    ],
    type: 'Full-time',
    experience: '1-4 years',
    location: 'Delhi NCR / Noida',
    fit: 'A numbers-focused candidate with a strong reporting and optimisation mindset.',
  },
  {
    slug: 'graphic-designer',
    title: 'Graphic Designer / Creative Executive',
    department: 'Creative',
    summary: 'Create clean, conversion-focused creatives for ads, social media, websites and campaigns.',
    points: [
      'Create ad creatives, posters, social posts, website banners and thumbnails.',
      'Maintain brand consistency across group companies.',
      'Deliver fast revisions with clean design quality.',
    ],
    type: 'Full-time',
    experience: '1-3 years',
    location: 'Delhi NCR / Noida',
    fit: 'Photoshop, Illustrator, Canva, Figma or CorelDRAW. A portfolio or work sample is required.',
  },
  {
    slug: 'hr-executive',
    title: 'HR Executive / Recruiter',
    department: 'Human resources',
    summary: 'Manage recruitment, onboarding, employee documentation, interview coordination and HR communication.',
    points: [
      'Post jobs, call and screen candidates, and schedule interviews.',
      'Maintain employee records and joining documentation.',
      'Handle HR communication with care and confidentiality.',
    ],
    type: 'Full-time',
    location: 'Delhi NCR / Noida',
    fit: 'Good communication and a strong sense of confidentiality.',
  },
  {
    slug: 'customer-support-executive',
    title: 'Customer Support Executive',
    department: 'Support',
    summary: 'Handle customer queries, complaints, order updates and coordination with internal teams.',
    points: [
      'Handle customer queries on calls and WhatsApp.',
      'Resolve complaints and report on support every day.',
      'Coordinate with internal teams to close open issues.',
    ],
    type: 'Full-time',
    location: 'Delhi NCR / Noida',
    fit: 'Patience, clarity and problem-solving.',
  },
  {
    slug: 'operations-executive',
    title: 'Courier / QC / RTO Executive',
    department: 'Operations',
    summary: 'Manage shipment tracking, returns, quality checks and delivery coordination.',
    points: [
      'Track courier shipments and update customers on delivery.',
      'Manage returns, quality checks, dispatch and reporting.',
      'Keep operational records accurate in Excel.',
    ],
    type: 'Full-time',
    location: 'Delhi NCR / Noida',
    fit: 'Excel skills and operational discipline.',
  },
];

export const departments = [...new Set(roles.map((r) => r.department))];

export const applyProfiles = [
  ...roles.map((r) => r.title),
  'Video Editor / Content Creator',
  'SEO / Website Executive',
  'Accounts / Admin Executive',
  'Other profile',
];

export const experienceOptions = ['Fresher', '0-1 year', '1-2 years', '2-4 years', '4+ years'];

export const whyJoin = [
  { title: 'Real business problems', text: 'Exposure to customer handling, team coordination and execution-based growth from the first month.' },
  { title: 'Clear expectations', text: 'Performance is measured through output, reporting, discipline and ownership.' },
  { title: 'Skills that transfer', text: 'Practical learning in sales, marketing, operations, HR, design, support and digital systems.' },
  { title: 'Multi-sector exposure', text: 'Work across healthcare, aesthetics, IT, logistics, real estate, FMCG, trading and education.' },
  { title: 'Structured reporting', text: 'Clear reporting lines, documented procedures, follow-ups and accountability.' },
  { title: 'Bigger roles for performers', text: 'People who perform consistently move into senior roles, team handling and business responsibility.' },
];

export const verticals = [
  { title: 'Healthcare and skincare', text: 'Consultation, customer handling, product support, healthcare operations and patient coordination.' },
  { title: 'Aesthetics and clinic', text: 'Clinic coordination, skin counselling, treatment support, front desk and customer experience.' },
  { title: 'Aesthetic academy', text: 'Admissions counselling, student coordination, training support and education marketing.' },
  { title: 'IT and security', text: 'Technical coordination, security operations, IT support, systems management and business development.' },
  { title: 'Logistics and operations', text: 'Courier support, returns management, order tracking, reporting and dispatch.' },
  { title: 'Real estate and construction', text: 'Project coordination, documentation, vendor coordination and administration.' },
  { title: 'FMCG and trading', text: 'Sales, supply coordination, product distribution and field support.' },
  { title: 'Corporate and HR', text: 'Recruitment, employee coordination, documentation, reporting and internal communication.' },
  { title: 'Marketing and digital growth', text: 'Performance marketing, SEO, content, design, video, social media and lead generation.' },
];

export const hiringProcess = [
  { title: 'Apply', text: 'Submit accurate details with your role preference, experience and resume.' },
  { title: 'HR screening', text: 'HR checks communication, experience, role fit and basic expectations.' },
  { title: 'Interview or task', text: 'Shortlisted candidates are invited to an interview or given a practical task.' },
  { title: 'Selection', text: 'Final role, salary, joining date, reporting and onboarding are discussed.' },
];

export const whoShouldApply = [
  'People serious about long-term career growth.',
  'Candidates comfortable with targets and reporting.',
  'People who learn fast and execute faster.',
  'Candidates who take ownership.',
  'People interested in business, healthcare, marketing, sales, operations, IT or corporate roles.',
];

export const careersFaq = [
  {
    q: 'Which roles are available at Devriz Group?',
    a: 'Devriz Group hires for sales, digital marketing, paid ads, graphic design, HR, customer support, clinic coordination, operations, courier and returns, content, video editing, SEO, website, accounts, admin and other business roles.',
  },
  {
    q: 'Can freshers apply?',
    a: 'Yes. Freshers can apply for selected roles such as telecalling, sales support, customer support, HR support, content and design internships, operations support and coordination roles.',
  },
  {
    q: 'Is experience required?',
    a: 'It depends on the role. Paid ads, design, video editing, HR and digital marketing roles generally need relevant skills or work samples. Sales and support roles may accept freshers with strong communication.',
  },
  {
    q: 'What is the work location?',
    a: 'Most office-based roles are in Delhi NCR or Noida, depending on the department and company. The final location is confirmed during screening.',
  },
  {
    q: 'Will there be a practical task?',
    a: 'Practical tasks may be given for graphic design, paid ads, digital marketing, video editing, content writing, SEO and website roles.',
  },
  {
    q: 'How will shortlisted candidates be contacted?',
    a: 'Shortlisted candidates are contacted by HR through a call, WhatsApp or email for screening and interview scheduling. Devriz Group never asks candidates for money at any stage.',
  },
];
