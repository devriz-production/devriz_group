// The seven business sectors. Slugs match the URLs already published in the
// live site's navigation, so nothing has to be redirected.

export type Sector = {
  slug: string;
  name: string;
  short: string;
  icon: string;
  tagline: string;
  summary: string;
  overview: string[];
  capabilities: { title: string; text: string }[];
  approach?: { heading: string; steps: { title: string; text: string }[] };
  facts?: { value: string; label: string }[];
  image: string;
  imageAlt: string;
};

export const sectors: Sector[] = [
  {
    slug: 'healthcare-wellness',
    name: 'Healthcare and wellness',
    short: 'Healthcare',
    icon: 'stethoscope',
    tagline: 'A consultation-first healthcare ecosystem for skin, hair and body care.',
    summary: 'Doctor-led consultation, professional skincare products and clinic-based aesthetic treatment.',
    overview: [
      'Healthcare today is not only about products or treatments. It needs diagnosis, expert guidance, safe solutions and continuous care. This is the sector the group started in, and it remains the foundation.',
      'The group is building an ecosystem where consultation, wellness products and aesthetic services work together. Customers are guided by a professional before anything is recommended, and they can move from an online consultation to in-clinic care when they need it.',
    ],
    capabilities: [
      { title: 'Diagnosis first', text: 'We understand the concern before recommending any solution.' },
      { title: 'Professional care', text: 'Expert consultation, guided treatment and patient-focused support.' },
      { title: 'Accessible wellness', text: 'Skin, hair, body and lifestyle care made more approachable across India.' },
      { title: 'Digital and clinic together', text: 'Online consultation with clinic access where advanced care is needed.' },
    ],
    approach: {
      heading: 'How the healthcare model works',
      steps: [
        { title: 'Understand the concern', text: 'We begin by identifying the skin, hair, body or lifestyle concern.' },
        { title: 'Expert consultation', text: 'The concern is reviewed through a consultation-led approach for better clarity.' },
        { title: 'Personalised recommendation', text: 'Customers receive care guidance based on their concern and requirement.' },
        { title: 'Treatment or product support', text: 'Support may include guided care, products or clinic-based treatment.' },
        { title: 'Follow-up and tracking', text: 'Continuous support improves trust, compliance and treatment outcomes.' },
      ],
    },
    facts: [
      { value: '2018', label: 'Healthcare journey started' },
      { value: 'Skin, hair, body', label: 'Core concern categories' },
      { value: 'Digital + clinic', label: 'Hybrid care model' },
    ],
    image: 'sector-healthcare-wellness',
    imageAlt: 'A doctor in consultation with a patient at a Devriz Group clinic',
  },
  {
    slug: 'technology-security',
    name: 'Technology and security',
    short: 'Technology',
    icon: 'cpu',
    tagline: 'Digital infrastructure and on-ground security for businesses that cannot afford downtime.',
    summary: 'IT infrastructure, hosting, applications and cybersecurity, alongside security manpower.',
    overview: [
      'Through Global Alpha Tech Security, the group helps businesses build reliable digital systems: websites and applications, cloud-ready platforms, hosting support, automation workflows and security-focused architecture.',
      'Devriz Segurana Safety & Security adds the physical side, providing safety and security manpower. Together they cover the systems a business runs on and the premises it runs from.',
    ],
    capabilities: [
      { title: 'Website and application development', text: 'Fast, responsive websites and Android and iOS applications with backend support.' },
      { title: 'Cloud and hosting', text: 'Cloud-ready platforms, hosting guidance, server setup and performance optimisation.' },
      { title: 'Cybersecurity approach', text: 'Security-focused planning for websites, applications, hosting access and digital workflows.' },
      { title: 'Managed data workflows', text: 'Backup readiness, storage guidance, reporting dashboards and workflow automation.' },
      { title: 'Monitoring and support', text: 'Issue monitoring, technical coordination, maintenance and troubleshooting.' },
      { title: 'Security manpower', text: 'Safety and security manpower services for sites and facilities.' },
    ],
    approach: {
      heading: 'Structured technology execution',
      steps: [
        { title: 'Requirement analysis', text: 'Understanding business goals, platform needs, hosting requirements and operational gaps.' },
        { title: 'Infrastructure planning', text: 'Planning websites, apps, cloud-ready systems, automation and secure workflows.' },
        { title: 'Implementation', text: 'Developing platforms, setting up workflows and coordinating technical execution.' },
        { title: 'Monitoring and support', text: 'Supporting performance, updates, troubleshooting and long-term improvement.' },
      ],
    },
    image: 'sector-technology-security',
    imageAlt: 'Server racks in a data centre aisle',
  },
  {
    slug: 'infrastructure-real-estate',
    name: 'Infrastructure and real estate',
    short: 'Infrastructure',
    icon: 'buildings',
    tagline: 'Residential, commercial and civil construction, delivered with structure.',
    summary: 'Three construction companies covering residential and commercial building and civil infrastructure.',
    overview: [
      'The group builds through three companies: Devriz Builder Construction, Ranjana Devi Construction and Krishna Construction. Between them they take on residential and commercial construction, civil works and infrastructure development.',
      'Construction is where process discipline shows most plainly. Each project runs on defined roles, documentation, vendor coordination and regular reporting, so that delivery does not depend on any one person.',
    ],
    capabilities: [
      { title: 'Residential construction', text: 'Housing projects built to a defined scope, schedule and quality standard.' },
      { title: 'Commercial construction', text: 'Commercial buildings delivered through structured project coordination.' },
      { title: 'Civil works', text: 'Civil construction and infrastructure development.' },
      { title: 'Project coordination', text: 'Documentation, vendor coordination and site reporting at every stage.' },
    ],
    image: 'sector-infrastructure-real-estate',
    imageAlt: 'A construction site with tower cranes at dawn',
  },
  {
    slug: 'consumer-fmcg',
    name: 'Consumer products and FMCG',
    short: 'Consumer',
    icon: 'package',
    tagline: 'Everyday products, from agro-based goods to personal care.',
    summary: 'Agro-based products and beauty, lifestyle and personal care for Indian households.',
    overview: [
      'The consumer business brings together agro-based products and personal care. PDR Agro and Gramin Industries work on agriculture-based goods and rural economic development. Devriz Fashion Lifestyle works on beauty, lifestyle and personal care.',
      'These are products people buy often and judge quickly. The group applies the same standard here as in healthcare: consistent quality, honest positioning, and supply and distribution that can be tracked.',
    ],
    capabilities: [
      { title: 'Agro-based products', text: 'Products developed from agricultural produce.' },
      { title: 'Personal care and lifestyle', text: 'Beauty, grooming and personal care solutions for everyday use.' },
      { title: 'Supply coordination', text: 'Sourcing and supply managed with reporting at each step.' },
      { title: 'Distribution', text: 'Product distribution and field support across markets.' },
    ],
    image: 'sector-consumer-fmcg',
    imageAlt: 'Packaged consumer products on a production line',
  },
  {
    slug: 'agriculture-trading',
    name: 'Agriculture and trading',
    short: 'Agriculture',
    icon: 'plant',
    tagline: 'Land, produce and commodities, managed for the long term.',
    summary: 'Agricultural land and produce, fodder and food grain trading, and tree farming.',
    overview: [
      'Agriculture and trading connect the group to the land. JNS Land & Agriculture manages agricultural land and produce. JNS Food Trading and Khanacap Foods trade in fodder, food grains and crops. Furniture & Tree Farming works on sustainable forestry and furniture operations.',
      'These businesses reward patience. They are held for the long term and run with the same reporting and accountability as every other company in the group.',
    ],
    capabilities: [
      { title: 'Land and produce management', text: 'Agricultural land and the produce grown on it, managed as a long-term asset.' },
      { title: 'Fodder and food grain trading', text: 'Trading that supports agricultural supply chains and improves market access.' },
      { title: 'Tree farming', text: 'Sustainable forestry planned over long growing cycles.' },
      { title: 'Furniture operations', text: 'Furniture operations that sit alongside the forestry business.' },
    ],
    image: 'sector-agriculture-trading',
    imageAlt: 'Rows of crops on farmland in northern India at sunrise',
  },
  {
    slug: 'logistics-transport',
    name: 'Logistics and transport',
    short: 'Logistics',
    icon: 'truck',
    tagline: 'Moving goods reliably, with tracking at every step.',
    summary: 'Transportation and logistics services, with dispatch, tracking and returns run to a set process.',
    overview: [
      'Autodell Transport is the group company for transportation and logistics services. It gives the group its own capability for moving goods by road.',
      'Logistics is run as a reporting discipline. Dispatch, courier coordination, delivery tracking and returns each have a standard procedure, and delivered and returned shipments are reviewed every week so that bottlenecks are found early.',
    ],
    capabilities: [
      { title: 'Transportation', text: 'Transportation and logistics services run by Autodell Transport.' },
      { title: 'Dispatch and courier coordination', text: 'A structured dispatch workflow with tracking discipline.' },
      { title: 'Tracking and customer updates', text: 'Tracking-driven updates shared proactively with customers.' },
      { title: 'Returns management', text: 'Standard procedures for quality checks, returns handling and issue resolution.' },
    ],
    image: 'sector-logistics-transport',
    imageAlt: 'Trucks at a logistics yard',
  },
  {
    slug: 'education-skilling',
    name: 'Education and skilling',
    short: 'Education',
    icon: 'graduation-cap',
    tagline: 'Practical aesthetic education for career-ready professionals.',
    summary: 'Hands-on aesthetic and skincare training with structured learning and real clinical exposure.',
    overview: [
      'India has a shortage of skilled professionals in aesthetic and healthcare services. The group invested in education to close that gap, starting with Kotil Aesthetic Academy.',
      'Training is treated as a serious business, not a side activity. Courses combine structured learning with practical exposure, so that students leave with skills employers can use. It strengthens the group and the wider industry at the same time.',
    ],
    capabilities: [
      { title: 'Practical skill development', text: 'Hands-on training with real practical exposure.' },
      { title: 'Industry-aligned curriculum', text: 'Course content built around what clinics and employers need.' },
      { title: 'Certification pathways', text: 'Professional certification for those entering the field.' },
      { title: 'Career-oriented training', text: 'Training models designed to lead to employment.' },
    ],
    image: 'sector-education-skilling',
    imageAlt: 'Students in an aesthetic training session with an instructor',
  },
];

export const getSector = (slug: string) => sectors.find((s) => s.slug === slug)!;

// Verticals the group has announced as in development on its own material.
export const inDevelopment = ['Ports and terminals', 'Infrastructure platforms', 'Capital markets'];
