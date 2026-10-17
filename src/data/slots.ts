// Every photograph the site expects, in one place.
// Drop a file named <id>.jpg / .png / .webp anywhere under src/assets/ and the
// matching slot fills itself on the next build. Until then the page shows a
// labelled placeholder. IMAGE-PROMPTS.md is the readable version of this list.

export type Slot = {
  id: string;
  w: number;
  h: number;
  usedOn: string;
  kind: 'generate' | 'real-photo';
  prompt: string;
};

export const houseStyle =
  'Editorial corporate photography, photorealistic, shot on a full-frame camera. Natural light with a cool neutral grade and restrained warm highlights. Real contemporary India (Delhi NCR, Uttar Pradesh, Bihar): authentic architecture, vehicles, clothing and faces. Calm, confident, unposed. Deep navy shadows, clean whites, no orange-and-teal look, no HDR glow, no lens flare. No text, no logos, no signage lettering, no watermark, no borders.';

export const slots: Slot[] = [
  {
    id: 'home-hero',
    w: 2880,
    h: 1620,
    usedOn: 'Homepage hero, full width behind the headline',
    kind: 'generate',
    prompt:
      'Wide cinematic aerial view at blue hour of a modern Indian business district: a glass office tower in the right third, a multi-lane expressway with soft light trails curving through the middle distance, construction cranes and farmland fading to the horizon. The left 45 percent of the frame is calm, darker sky and haze with no detail, left empty for a headline. Slightly elevated drone angle, 24mm, deep navy and steel blue tones with a thin band of amber on the horizon.',
  },
  {
    id: 'sector-healthcare-wellness',
    w: 2400,
    h: 1600,
    usedOn: 'Healthcare and wellness: homepage sector panel, businesses grid, sector page header',
    kind: 'generate',
    prompt:
      'An Indian dermatologist in a white coat, mid-30s, in consultation with a patient across a clean desk in a bright modern clinic. Shot from the side at eye level, the doctor in focus and the patient soft in the foreground. Pale stone and glass interior, daylight from a large window, uncluttered. Subject centred so the image can be cropped to portrait or to a wide strip. 50mm, shallow depth of field.',
  },
  {
    id: 'sector-technology-security',
    w: 2400,
    h: 1600,
    usedOn: 'Technology and security: homepage sector panel, businesses grid, sector page header',
    kind: 'generate',
    prompt:
      'A long symmetrical aisle between server racks in a data centre, cool white overhead lighting, small points of blue and amber status light. One Indian engineer in a dark shirt stands mid-aisle checking a tablet, seen from behind at a distance. Perforated floor tiles, cable trays overhead, very clean. Centred one-point perspective, 28mm.',
  },
  {
    id: 'sector-infrastructure-real-estate',
    w: 2400,
    h: 1600,
    usedOn: 'Infrastructure and real estate: homepage sector panel, businesses grid, sector page header',
    kind: 'generate',
    prompt:
      'A concrete high-rise under construction in Noida at early morning, two tower cranes against a pale clear sky, scaffolding and safety netting. In the lower third, two Indian site engineers in white helmets and high-visibility vests review a drawing, small in the frame. Low angle looking up, 24mm, crisp geometry, cool light with a warm edge on the concrete.',
  },
  {
    id: 'sector-consumer-fmcg',
    w: 2400,
    h: 1600,
    usedOn: 'Consumer products and FMCG: homepage sector panel, businesses grid, sector page header',
    kind: 'generate',
    prompt:
      'A clean modern packaging line in an Indian consumer goods facility: unbranded white bottles and plain cartons moving along a stainless steel conveyor, one worker in a hairnet and white coat checking a carton in soft focus behind. Bright even light, stainless steel and white surfaces, shallow depth of field, 50mm. All packaging blank with no labels or lettering.',
  },
  {
    id: 'sector-agriculture-trading',
    w: 2400,
    h: 1600,
    usedOn: 'Agriculture and trading: homepage sector panel, businesses grid, sector page header',
    kind: 'generate',
    prompt:
      'Flat farmland in Bihar just after sunrise: long straight rows of green crop running to a line of trees on the horizon, light mist, a farmer in a plain kurta walking along a field path in the middle distance. Low wide angle, 24mm, big clear sky taking the top half of the frame. Muted greens and soft gold, quiet and dignified.',
  },
  {
    id: 'sector-logistics-transport',
    w: 2400,
    h: 1600,
    usedOn: 'Logistics and transport: homepage sector panel, businesses grid, sector page header',
    kind: 'generate',
    prompt:
      'A row of clean white Indian cargo trucks backed up to loading docks at a modern warehouse at dawn, one truck pulling out. A dispatcher in a dark jacket with a tablet stands by the dock, small in the frame. Wet concrete reflecting soft light, long perspective down the dock line, 35mm. Truck sides plain white with no lettering.',
  },
  {
    id: 'sector-education-skilling',
    w: 2400,
    h: 1600,
    usedOn: 'Education and skilling: homepage sector panel, businesses grid, sector page header',
    kind: 'generate',
    prompt:
      'A hands-on aesthetics training session in a bright Indian academy: an instructor in a white coat demonstrates a facial treatment technique on a model lying on a treatment bed while four students in dark scrubs watch closely. Clean clinical classroom, daylight, shot at eye level from the foot of the bed, 35mm, natural concentration on the faces.',
  },
  {
    id: 'company-devriz-healthcare',
    w: 2000,
    h: 1500,
    usedOn: 'Devriz Healthcare: featured tile on the homepage, company page',
    kind: 'generate',
    prompt:
      'An Indian doctor in a white coat on a video consultation at a tidy desk, laptop open, making a note by hand. Soft window light from the left, pale neutral wall behind, a small plant. Three-quarter view, calm and attentive expression, 50mm, shallow depth of field. Laptop screen not visible.',
  },
  {
    id: 'company-kotil-skin-science',
    w: 2000,
    h: 1500,
    usedOn: 'Kotil Skin Science: featured tile on the homepage, company page',
    kind: 'generate',
    prompt:
      'Interior of a premium aesthetic skin clinic treatment room in Delhi: a treatment bed with crisp white linen, a slim modern device on a trolley, warm indirect lighting along a pale wall, glass and brushed steel details. No people. Composed and symmetrical, 28mm, quiet luxury without ornament.',
  },
  {
    id: 'company-global-alpha-tech',
    w: 2000,
    h: 1500,
    usedOn: 'Global Alpha Tech Security: featured tile on the homepage, company page',
    kind: 'generate',
    prompt:
      'A small network operations room at night: two Indian engineers seated at a long desk facing a wall of monitors showing abstract dashboards (blurred, no readable text). Dark room, cool screen light on their faces, seen from behind and slightly to one side, 35mm, shallow depth of field.',
  },
  {
    id: 'about-head-office',
    w: 2400,
    h: 1600,
    usedOn: 'About page and contact page: the corporate office',
    kind: 'real-photo',
    prompt:
      'Use a real photograph of the Wave One tower in Sector 18, Noida, where the corporate office is. Shoot from street level or a neighbouring rooftop at dusk, tower filling the right two-thirds, clean sky on the left. If a generated stand-in is needed for now: a tall blue-glass commercial tower in an Indian city at dusk, low angle, 24mm, clear sky, no signage.',
  },
  {
    id: 'about-team',
    w: 2400,
    h: 1350,
    usedOn: 'About page: who we are',
    kind: 'generate',
    prompt:
      'Five Indian professionals of mixed age and gender in a review meeting around a table in a glass-walled office, one person standing and pointing at a printed chart on the table. Business formal in navy, white and grey. Daylight, city visible and soft through the glass. Candid, mid-conversation, shot from across the table at seated eye level, 35mm.',
  },
  {
    id: 'about-journey',
    w: 2400,
    h: 1350,
    usedOn: 'Our journey page header',
    kind: 'generate',
    prompt:
      'A straight new highway in northern India at first light running to a vanishing point, seen from a low drone height. On the left of the road farmland, on the right a new commercial development with cranes. Empty road, light ground mist, cool blue tones with a warm line of light at the horizon, 24mm.',
  },
  {
    id: 'impact-hero',
    w: 2400,
    h: 1350,
    usedOn: 'Impact page header and homepage impact band',
    kind: 'generate',
    prompt:
      'A well-kept gaushala in rural Uttar Pradesh in soft morning light: healthy Indian cows in a clean open shed, a caretaker in a simple kurta gently feeding one by hand. Dust-free yard, neem tree shade, calm and respectful. Shot at cow eye level, 35mm, shallow depth of field. Keep the left third of the frame open and uncluttered for text.',
  },
  {
    id: 'impact-community',
    w: 2000,
    h: 1500,
    usedOn: 'Impact page: community initiatives',
    kind: 'generate',
    prompt:
      'Volunteers and local residents planting saplings together along a village road in Bihar, a woman in a cotton saree pressing soil around a young tree while two children watch. Overcast soft light, green surroundings, natural smiles, documentary style, 35mm.',
  },
  {
    id: 'impact-skilling',
    w: 2000,
    h: 1500,
    usedOn: 'Impact page: skilling and employment',
    kind: 'generate',
    prompt:
      'A young Indian woman in dark scrubs practising a skin analysis technique on a classmate under the guidance of an instructor, in a bright training room. Focus on her concentrated face and hands, instructor soft behind, 50mm, shallow depth of field, clean neutral background.',
  },
  {
    id: 'impact-gaushala-nandani',
    w: 2000,
    h: 1500,
    usedOn: 'Impact page: Nandani Gaushala (optional, the entry shows text only until a photo is supplied)',
    kind: 'real-photo',
    prompt:
      'Use a real photograph of Nandani Gaushala: the cattle shed or the animals in care, in daylight, with no people posed for the camera. Landscape, 4:3.',
  },
  {
    id: 'impact-gaushala-pehlagarh',
    w: 2000,
    h: 1500,
    usedOn: 'Impact page: Pehlagarh Gaushala (optional, the entry shows text only until a photo is supplied)',
    kind: 'real-photo',
    prompt:
      'Use a real photograph of Pehlagarh Gaushala: the cattle shed or the animals in care, in daylight, with no people posed for the camera. Landscape, 4:3.',
  },
  {
    id: 'careers-hero',
    w: 2400,
    h: 1350,
    usedOn: 'Careers page header and homepage careers section',
    kind: 'generate',
    prompt:
      'A modern open-plan Indian office mid-morning: a team of six at work, two colleagues talking over a laptop in the foreground, others at desks behind. Business casual in navy, white and grey. Floor-to-ceiling windows with a city view, plants, tidy desks. Candid, energetic but calm, shot from standing height, 28mm.',
  },
  {
    id: 'careers-life',
    w: 1600,
    h: 2000,
    usedOn: 'Careers page: life at Devriz (portrait crop)',
    kind: 'generate',
    prompt:
      'Two Indian colleagues, a woman and a man in their late 20s, walking and talking in a bright office corridor with glass walls, one holding a notebook. Portrait orientation, full figures, natural stride, daylight, 50mm, soft background.',
  },
  {
    id: 'news-multi-sector',
    w: 2400,
    h: 1350,
    usedOn: 'Newsroom: lead image for the multi-sector press release',
    kind: 'generate',
    prompt:
      'Layered long-lens view across an Indian city edge at golden hour: farmland in the foreground, a logistics yard and warehouses in the middle, residential towers and cranes behind, haze separating each layer. Compressed perspective, 135mm, muted palette, quiet and factual.',
  },
];

export const getSlot = (id: string) => slots.find((s) => s.id === id);
