export interface TrendItem {
  id: string;
  name: string;
  category: string;
  source_type: string;
  source_name: string;
  source_url: string;
  detected_at: string;
  location: string;
  confidence: number;
  momentum: 'Rising' | 'Stable' | 'Declining';
  growth_rate: string;
  audience: string;
  description: string;
  drivers: string[];
  business_relevance: number;
  opportunity_score: number;
  is_saved?: boolean;
  image?: string;
  shortHeadline?: string;
  actionPrompt?: string;
  trendStatus?: 'RISING' | 'EMERGING' | 'FAST GROWING' | 'WATCH' | 'LOCAL SIGNAL';
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface BusinessProfile {
  id: string;
  name: string;
  category: string;
  country: string;
  state: string;
  city: string;
  localMarket: string;
  targetCustomers: string;
  productsServices: string;
  businessSize: string;
  channels: string[];
  goals: string[];
  preferredCategories: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SmartAlert {
  id: string;
  trendId: string;
  trendName: string;
  category: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  businessFit: number;
  potential: 'HIGH' | 'MODERATE' | 'LOW';
  headline: string;
  whyItMatters: string;
  recommendedNextStep: string;
  detectedAt: string;
  dismissed: boolean;
  saved: boolean;
}

export interface ActionPlan {
  id: string;
  businessId: string;
  trendId: string;
  trendName: string;
  category: string;
  objective: string;
  whyThisTrend: string;
  recommendedAction: string;
  targetCustomer: string;
  productServiceIdea: string;
  marketingApproach: string;
  channel: string;
  pilot: string;
  timeline: string;
  estimatedEffort: 'Low' | 'Medium' | 'High';
  expectedOpportunity: 'Low' | 'Medium' | 'High';
  risks: string[];
  successMetrics: string[];
  testMeasureLearn: {
    test: string;
    measure: string;
    learn: string;
    adapt: string;
  };
  validationStatus: 'AI GENERATED' | 'PENDING EXPERT REVIEW' | 'APPROVED' | 'NEEDS REVISION' | 'REJECTED';
  expertReview?: {
    expertId: string;
    expertName: string;
    expertTitle: string;
    decision: 'APPROVED' | 'NEEDS REVISION' | 'REJECTED';
    comment: string;
    riskNote: string;
    suggestedModification: string;
    confidence: number;
    reviewedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Experiment {
  id: string;
  actionPlanId: string;
  name: string;
  businessId: string;
  trendName: string;
  objective: string;
  hypothesis: string;
  action: string;
  startDate: string;
  endDate: string;
  budget: string;
  successMetric: string;
  status: 'Planned' | 'Running' | 'Completed' | 'Paused';
  result?: {
    whatHappened: string;
    whatWorked: string;
    whatFailed: string;
    whatShouldChange: string;
    adaptAction: string;
    recordedAt: string;
  };
  createdAt: string;
}

export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  id: 'biz-default',
  name: '',
  category: '',
  country: '',
  state: '',
  city: '',
  localMarket: '',
  targetCustomers: '',
  productsServices: '',
  businessSize: '',
  channels: [],
  goals: [],
  preferredCategories: [],
  createdAt: '2026-09-15T09:00:00Z',
  updatedAt: '2026-10-10T12:00:00Z',
};

export const DEMO_TRENDS: TrendItem[] = [
  {
    id: 'tr-01',
    name: 'Plant-Based High-Protein Snacks',
    category: 'Food & Beverage',
    source_type: 'Social Media & Search',
    source_name: 'Regional Food Trend Crawl & Instagram Reels Signals',
    source_url: 'https://demo-trends.internal/food/plant-protein-signals',
    detected_at: '2026-10-08',
    location: 'Maharashtra (Tier 2 & 3 Hubs)',
    confidence: 94,
    momentum: 'Rising',
    growth_rate: '+46% MoM',
    audience: 'Health-conscious youth (18–30)',
    description: 'Surging demand for portable clean-label snacks featuring roasted millets, sprouted edamame, and herb-infused soya crisps among college students and gym-goers.',
    drivers: ['Fitness micro-influencers', 'Convenient grab-and-go packaging', 'Post-workout protein focus'],
    business_relevance: 92,
    opportunity_score: 89,
    is_saved: true,
  },
  {
    id: 'tr-02',
    name: 'Millet-Based Artisanal Breakfast',
    category: 'Food & Beverage',
    source_type: 'Industry Reports & News',
    source_name: 'Nutri-Cereal Innovation Survey 2026',
    source_url: 'https://demo-trends.internal/reports/millet-breakfast-surge',
    detected_at: '2026-10-09',
    location: 'Western India (Nashik-Pune-Sangamner Belt)',
    confidence: 91,
    momentum: 'Rising',
    growth_rate: '+38% MoM',
    audience: 'Health-conscious urban & semi-urban consumers (22–45)',
    description: 'Replacing processed flours with traditional jowar, bajra, and ragi in modern café formats like savory waffles, sourdough toasts, and overnight granola jars.',
    drivers: ['Government millet awareness drive', 'Digestive health benefits', 'Instagrammable café presentations'],
    business_relevance: 88,
    opportunity_score: 85,
    is_saved: false,
  },
  {
    id: 'tr-03',
    name: 'Zero-Proof Botanical Coolers & Kombucha',
    category: 'Food & Beverage',
    source_type: 'E-commerce & Local Search',
    source_name: 'Beverage Category Trend Radar',
    source_url: 'https://demo-trends.internal/beverage/zero-proof-coolers',
    detected_at: '2026-10-07',
    location: 'Maharashtra & Gujarat',
    confidence: 87,
    momentum: 'Rising',
    growth_rate: '+52% MoM',
    audience: 'Gen-Z and Young Working Professionals (19–32)',
    description: 'Sophisticated non-alcoholic craft beverages brewed with local florals (hibiscus, elderflower, kokum, lemongrass) gaining high traction as social evening drinks.',
    drivers: ['Mindful drinking movement', 'Aesthetic glassware photos on Instagram', 'Alternative to sugary carbonated sodas'],
    business_relevance: 86,
    opportunity_score: 83,
    is_saved: true,
  },
  {
    id: 'tr-04',
    name: 'Study & Co-Working Café Memberships',
    category: 'Local Services',
    source_type: 'Communities & Forums',
    source_name: 'Student Lifestyle & Freelancer Forums',
    source_url: 'https://demo-trends.internal/local/cafe-coworking-shifts',
    detected_at: '2026-10-05',
    location: 'Educational Hubs in Maharashtra',
    confidence: 89,
    momentum: 'Rising',
    growth_rate: '+29% MoM',
    audience: 'Engineering/Pharmacy students, Remote workers (18–28)',
    description: 'College students seeking quiet café corners with fast Wi-Fi and power outlets for study sessions, willing to buy prepaid subscription passes with coffee credits.',
    drivers: ['Exam prep seasons', 'Lack of modern quiet libraries', 'Desire for aesthetic workspace atmosphere'],
    business_relevance: 90,
    opportunity_score: 86,
    is_saved: false,
  },
  {
    id: 'tr-05',
    name: 'Sustainable Thrift & Upcycled Streetwear',
    category: 'Fashion',
    source_type: 'Social Media',
    source_name: 'TikTok/Instagram Reels Trend Monitor',
    source_url: 'https://demo-trends.internal/fashion/upcycled-streetwear',
    detected_at: '2026-10-06',
    location: 'National (Tier 1 & Tier 2 cities)',
    confidence: 93,
    momentum: 'Rising',
    growth_rate: '+61% MoM',
    audience: 'College students and Gen-Z creatives (16–25)',
    description: 'Vintage oversized jackets, patched denim, and upcycled graphic tees sold via limited weekly online drops and weekend pop-up markets.',
    drivers: ['Budget constraints paired with unique individual style', 'Eco-consciousness', 'Celebrity thrift aesthetics'],
    business_relevance: 42,
    opportunity_score: 45,
    is_saved: false,
  },
  {
    id: 'tr-06',
    name: 'Clean Ayurvedic Skincare Sticks',
    category: 'Beauty',
    source_type: 'E-commerce & D2C Reviews',
    source_name: 'Beauty Retail Intelligence Feed',
    source_url: 'https://demo-trends.internal/beauty/ayurvedic-stick-formats',
    detected_at: '2026-10-04',
    location: 'All India Urban & Semi-Urban',
    confidence: 88,
    momentum: 'Rising',
    growth_rate: '+44% MoM',
    audience: 'Working women and college students (18–35)',
    description: 'Mess-free, solid stick formulations of turmeric, neem, and saffron for rapid on-the-go sun protection and spot treatment without sticky fingers.',
    drivers: ['Convenience during commutes', 'Travel-friendly packaging', 'Ayurvedic trust with modern delivery'],
    business_relevance: 35,
    opportunity_score: 40,
    is_saved: false,
  },
  {
    id: 'tr-07',
    name: 'AI-Powered Local Tutoring & Micro-Courses',
    category: 'Education',
    source_type: 'Search & Communities',
    source_name: 'EdTech Trend Index 2026',
    source_url: 'https://demo-trends.internal/education/ai-micro-coaching',
    detected_at: '2026-10-03',
    location: 'Maharashtra & South India',
    confidence: 95,
    momentum: 'Rising',
    growth_rate: '+73% MoM',
    audience: 'High school & undergraduate students (15–23)',
    description: 'Bite-sized, bilingual AI practice quizzes with 1-on-1 human mentor office hours, replacing rigid 2-year traditional coaching institute packages.',
    drivers: ['Competitive exam stress relief', 'Vernacular language AI support', 'Pay-per-doubt micro pricing'],
    business_relevance: 48,
    opportunity_score: 52,
    is_saved: false,
  },
  {
    id: 'tr-08',
    name: 'QR-Code Gamified Loyalty with Secret Perks',
    category: 'Retail',
    source_type: 'Competitor Activity & POS Data',
    source_name: 'Next-Gen Merchant Tech Watch',
    source_url: 'https://demo-trends.internal/retail/gamified-qr-loyalty',
    detected_at: '2026-10-09',
    location: 'Regional Commercial Districts',
    confidence: 92,
    momentum: 'Rising',
    growth_rate: '+55% MoM',
    audience: 'Frequent retail shoppers & café visitors (18–40)',
    description: 'Simple frictionless WhatsApp or browser-based scratch cards unlocked on every 3rd visit, revealing mystery off-menu items or surprise complimentary pairings.',
    drivers: ['App fatigue (users refuse to download heavy loyalty apps)', 'Instant gratification dopamine', 'Word-of-mouth bragging'],
    business_relevance: 94,
    opportunity_score: 91,
    is_saved: true,
  },
  {
    id: 'tr-09',
    name: 'Single-Origin Cold Brew Cans for On-the-Go',
    category: 'Food & Beverage',
    source_type: 'E-commerce & Quick Commerce',
    source_name: 'D2C Beverage Velocity Tracker',
    source_url: 'https://demo-trends.internal/beverage/canned-coldbrew',
    detected_at: '2026-10-08',
    location: 'Maharashtra Urban Belts',
    confidence: 86,
    momentum: 'Rising',
    growth_rate: '+34% MoM',
    audience: 'Corporate professionals and college seniors (21–34)',
    description: 'Locally roasted Chikmagalur single-origin nitro cold brews in sleek aluminium cans, offering intense smooth flavor without bitterness or added sugar.',
    drivers: ['High caffeine preference without heat', 'Ready-to-drink convenience', 'Third-wave coffee culture adoption'],
    business_relevance: 89,
    opportunity_score: 87,
    is_saved: false,
  },
  {
    id: 'tr-10',
    name: 'Pet-Friendly Weekend Community Mixers',
    category: 'Local Services',
    source_type: 'Social Media & Events',
    source_name: 'Urban Pet Parents Network',
    source_url: 'https://demo-trends.internal/community/pet-friendly-mixers',
    detected_at: '2026-10-02',
    location: 'Tier 1 & Tier 2 Commercial Hubs',
    confidence: 84,
    momentum: 'Stable',
    growth_rate: '+18% MoM',
    audience: 'Young couples and single pet owners (23–38)',
    description: 'Open-air café courtyards hosting Sunday pup-cinos, pet costume contests, and adoption awareness drives, generating viral social tags.',
    drivers: ['Pet humanization trend', 'Weekend socialization needs', 'High organic user-generated content creation'],
    business_relevance: 78,
    opportunity_score: 72,
    is_saved: false,
  },
  {
    id: 'tr-11',
    name: 'Refillable Zero-Waste Home Essentials Stations',
    category: 'Retail',
    source_type: 'Industry Reports',
    source_name: 'Eco-Living Retail Monitor 2026',
    source_url: 'https://demo-trends.internal/retail/refillable-stations',
    detected_at: '2026-09-28',
    location: 'Western India',
    confidence: 79,
    momentum: 'Stable',
    growth_rate: '+12% MoM',
    audience: 'Eco-conscious households (28–50)',
    description: 'Bring-your-own-bottle dispensers for bio-enzyme laundry liquids, natural dish soaps, and cold-pressed cooking oils at local grocers.',
    drivers: ['Plastic reduction sentiment', '15% savings compared to packaged brands', 'Community sustainability pride'],
    business_relevance: 38,
    opportunity_score: 41,
    is_saved: false,
  },
  {
    id: 'tr-12',
    name: 'Micro-Batch Fermented Condiments (Hot Honey, Garlic Chili Crunch)',
    category: 'Food & Beverage',
    source_type: 'Video & Audio',
    source_name: 'Culinary Creator Signal Feed',
    source_url: 'https://demo-trends.internal/food/fermented-condiments',
    detected_at: '2026-10-07',
    location: 'All India Foodies & Cafés',
    confidence: 90,
    momentum: 'Rising',
    growth_rate: '+48% MoM',
    audience: 'Foodies, home cooks, café regulars (18–40)',
    description: 'Habit-forming spicy-sweet condiments drizzled across pizzas, artisan sandwiches, and fried snacks, offering high perceived gourmet quality with low prep time.',
    drivers: ['Viral TikTok/Reels recipe creators', 'Demand for bold complex umami flavor profiles', 'High retail jar margin for cafés'],
    business_relevance: 91,
    opportunity_score: 88,
    is_saved: false,
  },
  {
    id: 'tr-13',
    name: 'Voice-Activated Regional Language Search for Small Shops',
    category: 'Technology',
    source_type: 'External APIs & Search',
    source_name: 'Regional Internet Trends Report 2026',
    source_url: 'https://demo-trends.internal/tech/vernacular-voice-commerce',
    detected_at: '2026-10-01',
    location: 'Maharashtra & Central India',
    confidence: 85,
    momentum: 'Rising',
    growth_rate: '+36% MoM',
    audience: 'Semi-urban consumers and shopkeepers',
    description: 'Marathi and Hindi voice queries on WhatsApp and Google Maps to search neighborhood stores, product availability, and operating hours.',
    drivers: ['Smartphone accessibility', 'Frictionless local commerce', 'AI speech-to-text accuracy in Indic languages'],
    business_relevance: 72,
    opportunity_score: 75,
    is_saved: false,
  },
  {
    id: 'tr-14',
    name: 'Hyper-Personalized Vitamin & Herb Subscriptions',
    category: 'Healthcare',
    source_type: 'Patents & Research',
    source_name: 'Preventative Wellness Journal Index',
    source_url: 'https://demo-trends.internal/health/custom-vitamin-packs',
    detected_at: '2026-09-30',
    location: 'Urban India',
    confidence: 82,
    momentum: 'Stable',
    growth_rate: '+15% MoM',
    audience: 'Working professionals (25–45)',
    description: 'Daily sachet packs containing tailored combinations of Ashwagandha, Omega-3, and Vitamin D based on lifestyle questionnaires.',
    drivers: ['Preventative healthcare lifestyle', 'Pill fatigue reduction', 'Recurring subscription models'],
    business_relevance: 40,
    opportunity_score: 44,
    is_saved: false,
  },
  {
    id: 'tr-15',
    name: 'Midnight Dessert Deliveries & Late-Night Snacking',
    category: 'Food & Beverage',
    source_type: 'E-commerce & Food Aggregators',
    source_name: 'Late-Night Order Heatmap 2026',
    source_url: 'https://demo-trends.internal/food/late-night-snacking',
    detected_at: '2026-10-08',
    location: 'College Towns & Semi-Urban Hubs',
    confidence: 93,
    momentum: 'Rising',
    growth_rate: '+41% MoM',
    audience: 'Hostel students, exam candidates, night-shift coders (18–26)',
    description: 'Surge in orders between 10:30 PM and 1:30 AM for warm brownies, stuffed croissants, hot artisanal cocoa, and savory wraps.',
    drivers: ['Late night study sessions', 'Lack of quality dining after 10 PM', 'High average order value with minimal kitchen overhead'],
    business_relevance: 93,
    opportunity_score: 92,
    is_saved: true,
  },
  {
    id: 'tr-16',
    name: 'Eco-Friendly Plantable Stationery & Seed Envelopes',
    category: 'Retail',
    source_type: 'Communities & Forums',
    source_name: 'Sustainable Living Forum India',
    source_url: 'https://demo-trends.internal/retail/plantable-paper-goods',
    detected_at: '2026-09-22',
    location: 'Schools, Colleges & Gift Shops',
    confidence: 76,
    momentum: 'Declining',
    growth_rate: '-8% MoM',
    audience: 'Eco-conscious gift buyers (20–40)',
    description: 'Pencils with tomato/basil seed capsules and greeting cards made of recycled seed paper that grow into plants when planted in soil.',
    drivers: ['Novelty gifting plateauing', 'Variable germination success rates created mild disappointment'],
    business_relevance: 31,
    opportunity_score: 28,
    is_saved: false,
  },
  {
    id: 'tr-17',
    name: 'Interactive Culinary Workshops & Barista Masterclasses',
    category: 'Local Services',
    source_type: 'Social Media & Ticketing',
    source_name: 'Weekend Experiential Booking Signals',
    source_url: 'https://demo-trends.internal/experiential/barista-workshops',
    detected_at: '2026-10-05',
    location: 'Tier 2 & 3 Growing Cities',
    confidence: 88,
    momentum: 'Rising',
    growth_rate: '+37% MoM',
    audience: 'Couples, young hobbyists, college students (18–35)',
    description: '2-hour weekend workshops where participants learn latte art, manual brewing methods (V60, Aeropress), and sourdough basics while enjoying café snacks.',
    drivers: ['Craving for offline tactile experiences', 'Social media hobby bragging', 'Monetizing off-peak Sunday morning café capacity'],
    business_relevance: 95,
    opportunity_score: 93,
    is_saved: true,
  },
  {
    id: 'tr-18',
    name: 'Bespoke Personalized Phone Accessories & Charms',
    category: 'Fashion',
    source_type: 'E-commerce & Flea Markets',
    source_name: 'Gen-Z Accessory Volume Index',
    source_url: 'https://demo-trends.internal/fashion/beaded-charms-y2k',
    detected_at: '2026-09-29',
    location: 'College Campuses & Urban Youth',
    confidence: 81,
    momentum: 'Stable',
    growth_rate: '+5% MoM',
    audience: 'High school and college students (14–22)',
    description: 'Custom beaded wrist lanyards, acrylic photocard phone grip holders, and holographic sticker packs matching daily aesthetic outfits.',
    drivers: ['Y2K nostalgic fashion revival', 'Low price point impulse purchases', 'Frequent style rotation'],
    business_relevance: 39,
    opportunity_score: 42,
    is_saved: false,
  },
  {
    id: 'tr-19',
    name: 'Micro-Influencer Co-Created Menu Items',
    category: 'Food & Beverage',
    source_type: 'Social Media & Creator Economy',
    source_name: 'Regional Creator Campaign Tracker',
    source_url: 'https://demo-trends.internal/marketing/creator-menu-collabs',
    detected_at: '2026-10-06',
    location: 'District Headquarters & College Towns',
    confidence: 91,
    momentum: 'Rising',
    growth_rate: '+49% MoM',
    audience: 'Local youth followers of regional food vloggers (16–28)',
    description: 'Collaborating with 3 local food creators (5k-25k followers) to name and launch limited edition beverages or dessert burgers with profit share.',
    drivers: ['Direct trust in local relatable creators', 'Guaranteed viral reach on regional Instagram Reels', 'Zero upfront marketing agency retainer'],
    business_relevance: 96,
    opportunity_score: 95,
    is_saved: true,
  },
  {
    id: 'tr-20',
    name: 'Low-GI Artisan Breads & Sourdough Pastries',
    category: 'Food & Beverage',
    source_type: 'Industry Reports & Search',
    source_name: 'Baking Industry Wellness Outlook 2026',
    source_url: 'https://demo-trends.internal/bakery/low-gi-sourdough',
    detected_at: '2026-10-04',
    location: 'Maharashtra & Gujarat',
    confidence: 86,
    momentum: 'Rising',
    growth_rate: '+31% MoM',
    audience: 'Health-conscious families & fitness enthusiasts (24–50)',
    description: 'Naturally fermented long-fermentation loaves and seeded brioche buns that avoid sharp blood sugar spikes, pairing well with café toasties.',
    drivers: ['Metabolic health and pre-diabetes awareness', 'Artisan craftsmanship appreciation', 'Superior flavor crust vs commercial sliced bread'],
    business_relevance: 89,
    opportunity_score: 84,
    is_saved: false,
  },
  {
    id: 'tr-21',
    name: 'Biodegradable Sugarcane Bagasse Takeaway Packaging',
    category: 'Retail',
    source_type: 'Patents & Research',
    source_name: 'Sustainable Packaging Index 2026',
    source_url: 'https://demo-trends.internal/packaging/bagasse-takeaway',
    detected_at: '2026-09-25',
    location: 'India Commercial Centers',
    confidence: 88,
    momentum: 'Rising',
    growth_rate: '+27% MoM',
    audience: 'Cafés, cloud kitchens, and takeaway patrons',
    description: 'Compostable meal containers made of sugarcane residual fiber that maintain heat without soggy collapse, replacing single-use plastic boxes.',
    drivers: ['Strict regional plastic ban enforcement', 'Consumer negative sentiment toward hot food in flimsy plastic', 'Closing price parity with foil/plastic'],
    business_relevance: 85,
    opportunity_score: 81,
    is_saved: false,
  },
  {
    id: 'tr-22',
    name: 'Boutique Express Car Detailing & Waterless Wash',
    category: 'Local Services',
    source_type: 'Search & Maps',
    source_name: 'Automotive Local Services Pulse',
    source_url: 'https://demo-trends.internal/services/waterless-car-detailing',
    detected_at: '2026-09-18',
    location: 'Semi-Urban Maharashtra',
    confidence: 80,
    momentum: 'Stable',
    growth_rate: '+9% MoM',
    audience: 'Car and bike owners (25–55)',
    description: 'Eco-friendly waterless ceramic mist cleaning completed while owners are dining or shopping, booked via simple phone call or WhatsApp.',
    drivers: ['Water conservation awareness', 'Time-poor commuters', 'Pride in vehicle shine'],
    business_relevance: 25,
    opportunity_score: 29,
    is_saved: false,
  },
];

export const INITIAL_SMART_ALERTS: SmartAlert[] = [
  {
    id: 'alt-01',
    trendId: 'tr-01',
    trendName: 'Plant-Based High-Protein Snacks',
    category: 'Food & Beverage',
    urgency: 'HIGH',
    businessFit: 92,
    potential: 'HIGH',
    headline: 'Plant-based snacks are gaining rapid popularity among students & young professionals in your region.',
    whyItMatters: 'Over 46% surge in localized searches. Direct demographic match with FreshBite Café patrons seeking healthier afternoon bites.',
    recommendedNextStep: 'Pilot a 14-day "Roasted Millet Protein Box" combo paired with your signature iced latte.',
    detectedAt: '2 hours ago',
    dismissed: false,
    saved: true,
  },
  {
    id: 'alt-02',
    trendId: 'tr-19',
    trendName: 'Micro-Influencer Co-Created Menu Items',
    category: 'Food & Beverage',
    urgency: 'HIGH',
    businessFit: 96,
    potential: 'HIGH',
    headline: 'High-leverage localized creator campaigns are yielding 3x footfall lift for regional cafés.',
    whyItMatters: 'Local Sangamner college vloggers have high engagement among your core student customer segment.',
    recommendedNextStep: 'Invite 2 local student food creators to co-design an exclusive seasonal mocktail with a revenue-share voucher.',
    detectedAt: '1 day ago',
    dismissed: false,
    saved: false,
  },
  {
    id: 'alt-03',
    trendId: 'tr-08',
    trendName: 'QR-Code Gamified Loyalty with Secret Perks',
    category: 'Retail',
    urgency: 'MEDIUM',
    businessFit: 94,
    potential: 'HIGH',
    headline: 'Zero-friction WhatsApp scratch card loyalty is outperforming traditional punch cards.',
    whyItMatters: 'FreshBite Café customers visit frequently; a mystery 3rd-visit perk directly boosts repeat visit frequency.',
    recommendedNextStep: 'Deploy a WhatsApp QR code on dining tables offering a surprise pastry tasting on the 3rd checkout.',
    detectedAt: '2 days ago',
    dismissed: false,
    saved: true,
  },
  {
    id: 'alt-04',
    trendId: 'tr-15',
    trendName: 'Midnight Dessert Deliveries & Late-Night Snacking',
    category: 'Food & Beverage',
    urgency: 'HIGH',
    businessFit: 93,
    potential: 'HIGH',
    headline: 'Surge in late-night snack demand among hostel students during exam preparation months.',
    whyItMatters: 'Extended operating hours (10 PM to 12:30 AM) with limited menu items can capture uncontested student demand.',
    recommendedNextStep: 'Test an express "Night Owl Fuel Box" (warm brownie + cold brew) available for takeaway and campus delivery.',
    detectedAt: '3 days ago',
    dismissed: false,
    saved: false,
  },
];

export const INITIAL_ACTION_PLANS: ActionPlan[] = [
  {
    id: 'plan-01',
    businessId: 'biz-freshbite-sangamner',
    trendId: 'tr-01',
    trendName: 'Plant-Based High-Protein Snacks',
    category: 'Food & Beverage',
    objective: 'Introduce 2 high-margin plant-protein snack items to capture afternoon student footfall and generate ₹25,000 incremental monthly sales.',
    whyThisTrend: 'Students and young professionals in Sangamner actively search for post-gym and late-study energy bites that are healthier than fried samosas or commercial chips.',
    recommendedAction: 'Formulate and launch a grab-and-go "Super-Crunch Protein Box" (roasted spiced millets, herb edamame, and almonds) packaged in eco-friendly jars at FreshBite Café counter.',
    targetCustomer: 'Engineering & college students, gym regulars, and remote freelancers aged 18–30.',
    productServiceIdea: 'Two distinct SKUs: 1) "Zesty Peri-Peri Sprouted Millet Crunch" (₹85) and 2) "Dark Cocoa Espresso Protein Bites" (3 pcs for ₹95).',
    marketingApproach: 'In-store counter sample bowl with "Fuel Your Study Session" table cards + 15-second aesthetic Instagram reel featuring local student gym trainers.',
    channel: 'In-store Front Checkout Counter + WhatsApp VIP Broadcast announcement.',
    pilot: 'Batch 25 units per SKU daily for 14 days. Offer ₹20 bundle discount when purchased with any iced beverage.',
    timeline: 'Day 1–3: Recipe finalization and packaging. Day 4–5: Staff briefing & sampling. Day 6–19: 14-day live pilot test. Day 20: Performance review.',
    estimatedEffort: 'Low',
    expectedOpportunity: 'High',
    risks: [
      'Moisture ingress if glass/jar packaging is not sealed properly during monsoon.',
      'Slight hesitation on pricing if perceived as higher than unbranded roasted peanuts.',
    ],
    successMetrics: [
      'Sell-through rate > 80% across 14 consecutive pilot days',
      'Minimum 25% repeat purchase rate within 2 weeks',
      'At least 40 user Instagram story tags mentioning the snack box',
    ],
    testMeasureLearn: {
      test: 'Launch 2 plant-based snack options at the checkout counter for 14 days.',
      measure: 'Track daily units sold, average checkout ticket size, and customer tasting scores.',
      learn: 'Identify whether students prefer the savory peri-peri variant or sweet cocoa bites.',
      adapt: 'Expand the winning flavor to pre-packaged take-home pouches and bundle it with the breakfast meal pass.',
    },
    validationStatus: 'APPROVED',
    expertReview: {
      expertId: 'exp-arjun-mehta',
      expertName: 'Chef Arjun Mehta, Hospitality Strategy Consultant',
      expertTitle: 'Former Executive Chef & F&B Brand Advisor (15+ yrs experience)',
      decision: 'APPROVED',
      comment: 'Excellent strategic alignment with FreshBite’s counter flow. College students want guilt-free fuel between classes. The ₹85 price point is accessible yet yields a 68% gross margin.',
      riskNote: 'Ensure the spices do not overpower the natural crunch. Keep batch production daily to prevent oxidation of roasted seeds.',
      suggestedModification: 'Add a small transparent window or clear glass jar at the cash register so customers immediately see the premium texture.',
      confidence: 96,
      reviewedAt: '2026-10-09T14:30:00Z',
    },
    createdAt: '2026-10-08T10:00:00Z',
    updatedAt: '2026-10-09T14:30:00Z',
  },
  {
    id: 'plan-02',
    businessId: 'biz-freshbite-sangamner',
    trendId: 'tr-17',
    trendName: 'Interactive Culinary Workshops & Barista Masterclasses',
    category: 'Local Services',
    objective: 'Transform slow Sunday mornings (9:30 AM – 11:30 AM) into a revenue driver and brand-building experience generating ₹12,000 per weekend.',
    whyThisTrend: 'College students and young working couples in Sangamner lack creative weekend experiential activities and love hands-on coffee brewing.',
    recommendedAction: 'Host bi-weekly "Sunday Coffee Club: Handcraft Your Pour-Over & Latte Art" with 8 seats max per batch.',
    targetCustomer: 'Coffee enthusiasts, local couples, college students seeking unique weekend experiences.',
    productServiceIdea: 'Ticketed 90-minute hands-on masterclass: V60 pour-over technique, milk frothing basics, tasting flight of 3 beans, plus a signature croissant.',
    marketingApproach: 'Direct WhatsApp announcement to VIP list + aesthetic teaser reel on Instagram with limited seat countdown.',
    channel: 'Instagram bio booking link + WhatsApp VIP reservations.',
    pilot: 'Run 1 pilot session on the upcoming Sunday with 6 early bird seats priced at ₹399/person.',
    timeline: '1 week planning, pilot execution on Day 7, evaluate participant NPS on Day 8.',
    estimatedEffort: 'Medium',
    expectedOpportunity: 'High',
    risks: [
      'Barista stage fright or uneven speaking pacing',
      'No-shows if full prepayment is not collected at time of booking',
    ],
    successMetrics: [
      '100% seat fill rate (6/6 participants) within 48 hours of announcement',
      '100% attendee Net Promoter Score (rating 9 or 10 / 10)',
      'Each participant posts at least 1 Instagram story tagging @freshbitecafe',
    ],
    testMeasureLearn: {
      test: 'Host one 6-person masterclass on Sunday at 10 AM charging ₹399.',
      measure: 'Track attendee engagement, photo-sharing frequency, and repeat café visits within 14 days.',
      learn: 'Discover which brewing method excites attendees most and if they buy take-home coffee beans.',
      adapt: 'Scale to a monthly 2-tier masterclass series (Beginner Barista & Sourdough Toast Crafting) with retail bean pack bundles.',
    },
    validationStatus: 'PENDING EXPERT REVIEW',
    createdAt: '2026-10-10T08:15:00Z',
    updatedAt: '2026-10-10T08:15:00Z',
  },
  {
    id: 'plan-03',
    businessId: 'biz-freshbite-sangamner',
    trendId: 'tr-19',
    trendName: 'Micro-Influencer Co-Created Menu Items',
    category: 'Food & Beverage',
    objective: 'Partner with 2 regional food & campus creators to launch a co-branded drink, generating 200+ new first-time customer visits.',
    whyThisTrend: 'Local youth rely heavily on reels by student peers rather than sponsored institutional ads.',
    recommendedAction: 'Invite campus creators to formulate a secret "Creator Special" signature iced cooler with personalized table tent cards.',
    targetCustomer: 'Campus undergrads from local engineering, pharmacy, and arts colleges.',
    productServiceIdea: '"The Sangamner Sunset Cooler" (layered passionfruit, kokum, and sparkling botanical tonic).',
    marketingApproach: 'Collaborative Instagram reel posted on creator accounts with a secret promo code for 15% off.',
    channel: 'Instagram Collaborations + Campus Ambassador Word-of-Mouth.',
    pilot: 'Run for 21 days with 2 creators; offer creators ₹15 royalty per drink sold using their code.',
    timeline: 'Week 1: Creator tasting & recipe shoot. Weeks 2-4: Promotion & in-store rollout.',
    estimatedEffort: 'Medium',
    expectedOpportunity: 'High',
    risks: [
      'Creator delays in publishing agreed reel content',
      'Flavor profile inconsistency if baristas are not standardizing syrups',
    ],
    successMetrics: [
      'Over 25,000 views on collaborative reel across Sangamner geo-tags',
      'At least 150 redeemed creator discount codes in 21 days',
      '20% increase in weekday 3 PM–6 PM student footfall',
    ],
    testMeasureLearn: {
      test: 'Launch 1 creator drink with 2 campus vloggers for 21 days.',
      measure: 'Track code redemptions, follower growth on café profile, and average spend per new customer.',
      learn: 'Determine creator audience conversion efficiency vs organic footfall.',
      adapt: 'Rotate seasonal creator drinks quarterly with a top-voted student menu contest.',
    },
    validationStatus: 'NEEDS REVISION',
    expertReview: {
      expertId: 'exp-neha-joshi',
      expertName: 'Neha Joshi, Retail Brand & Marketing Strategist',
      expertTitle: 'Director at GrowthScale Retail Partners',
      decision: 'NEEDS REVISION',
      comment: 'Great creative angle, but the proposed 15% discount code could dilute margin given the creator royalty. We need to tighten the unit economics.',
      riskNote: 'Discount + royalty could leave less than 35% net margin. Need to protect café contribution profit.',
      suggestedModification: 'Instead of 15% discount, offer a free mini cookie pairing when purchasing the Creator drink at full menu price (₹120). This preserves cash margin while increasing perceived value.',
      confidence: 88,
      reviewedAt: '2026-10-10T11:00:00Z',
    },
    createdAt: '2026-10-09T16:00:00Z',
    updatedAt: '2026-10-10T11:00:00Z',
  },
];

export const INITIAL_EXPERIMENTS: Experiment[] = [
  {
    id: 'exp-01',
    actionPlanId: 'plan-01',
    name: 'Roasted Millet Super-Crunch Counter Pilot',
    businessId: 'biz-freshbite-sangamner',
    trendName: 'Plant-Based High-Protein Snacks',
    objective: 'Validate customer adoption and price threshold for high-protein healthy snacks at FreshBite checkout counter.',
    hypothesis: 'If we display 2 clear jars of roasted millet crunch next to the cash register priced at ₹85 with free tasting spoons, at least 20 students/day will purchase within 14 days.',
    action: 'Stock 25 packs each of Zesty Peri-Peri and Dark Cocoa bites daily. Brief baristas to invite every customer to taste a spoonful.',
    startDate: '2026-10-11',
    endDate: '2026-10-25',
    budget: '₹4,500 (Ingredients, biodegradable packaging, table tent cards)',
    successMetric: 'Sell-through > 80% daily (20+ units/day) with >= 20% repeat purchase rate.',
    status: 'Running',
    createdAt: '2026-10-10T14:00:00Z',
  },
  {
    id: 'exp-02',
    actionPlanId: 'plan-legacy-01',
    name: 'Artisan Cold Brew Bottle Tasting Flight',
    businessId: 'biz-freshbite-sangamner',
    trendName: 'Single-Origin Cold Brew Cans for On-the-Go',
    objective: 'Test whether afternoon students prefer ready-to-drink bottled cold brew over blended milk frappes.',
    hypothesis: 'Offering a 3-flavor mini tasting flight for ₹149 will convert 15 frappe drinkers into higher-margin cold brew regulars.',
    action: 'Brewed 5-liter batch of single-origin beans, bottled into 200ml glass jars with custom printed labels.',
    startDate: '2026-09-20',
    endDate: '2026-10-04',
    budget: '₹3,200',
    successMetric: 'At least 50 tasting flights sold over 2 weeks.',
    status: 'Completed',
    result: {
      whatHappened: 'Sold 74 tasting flights in 14 days, exceeding target by 48%. Total revenue generated was ₹11,026 against ₹3,200 cost.',
      whatWorked: 'The vanilla hazelnut cold brew variant was the runaway favorite (accounted for 62% of follow-up full bottle orders).',
      whatFailed: 'The unsweetened bold black roast had low repeat among college freshmen who found it too bitter.',
      whatShouldChange: 'Offer a sweetened oat-milk cold brew option to capture dairy-sensitive students.',
      adaptAction: 'Added Hazelnut Cold Brew permanently to the grab-and-go cooler; discontinued the ultra-dark unsweetened SKU.',
      recordedAt: '2026-10-05T18:00:00Z',
    },
    createdAt: '2026-09-18T10:00:00Z',
  },
];

export const TREND_SOURCES = [
  { id: 'src-1', category: 'Search Signals', name: 'Google Trends & Regional Query Velocity API', status: 'API Ready', mockActive: true, sampleFrequency: 'Real-time hourly', description: 'Tracks rising search keywords, query breakout percentages, and localized search volume.' },
  { id: 'src-2', category: 'Social Media', name: 'Instagram Reels & Short-form Video Trend Engine', status: 'API Ready', mockActive: true, sampleFrequency: 'Daily digest', description: 'Monitors viral audio tags, hashtag velocity, and creator comment sentiment.' },
  { id: 'src-3', category: 'E-commerce & Q-Commerce', name: 'Blinkit, Zepto & Amazon Category Rank Radar', status: 'API Ready', mockActive: true, sampleFrequency: '6-hour scan', description: 'Captures fastest-selling SKU shifts, out-of-stock signals, and new product launches.' },
  { id: 'src-4', category: 'News & Industry Blogs', name: 'F&B, Retail & D2C Editorial Crawler', status: 'API Ready', mockActive: true, sampleFrequency: 'Daily 04:00 AM', description: 'Indexes 1,200+ trade publications, market research digests, and food guides.' },
  { id: 'src-5', category: 'Industry Reports', name: 'National Retail Federation & Market Insights', status: 'Connected Mock', mockActive: true, sampleFrequency: 'Weekly batch', description: 'Formal market size estimates, demographic shifts, and consumer spending indices.' },
  { id: 'src-6', category: 'Communities & Forums', name: 'Reddit, Student Discord & City Forums', status: 'API Ready', mockActive: true, sampleFrequency: 'Continuous NLP', description: 'Unfiltered consumer chatter, recurring complaints with incumbents, and unmet desires.' },
  { id: 'src-7', category: 'Video & Audio Podcasts', name: 'YouTube Culinary & Retail Review Signals', status: 'API Ready', mockActive: true, sampleFrequency: 'Twice weekly', description: 'Transcription analysis of top food vloggers, cafe reviews, and product unboxings.' },
  { id: 'src-8', category: 'Patents & Research Papers', name: 'Food Technology & Agri Innovation Index', status: 'Connected Mock', mockActive: true, sampleFrequency: 'Monthly sync', description: 'Early-stage ingredient innovations, bio-packaging patents, and nutritional science.' },
  { id: 'src-9', category: 'Competitor Activity', name: 'Regional Merchant POS & Menu Changes Radar', status: 'API Ready', mockActive: true, sampleFrequency: 'Weekly delta', description: 'Price shifts, new menu introductions, and promotional offers across competitive sets.' },
  { id: 'src-10', category: 'Trend Networks', name: 'Global TrendWatching & WGSN Regional Signals', status: 'Connected Mock', mockActive: true, sampleFrequency: 'Bi-weekly feed', description: 'Macro consumer lifestyle trends adapted to emerging markets.' },
  { id: 'src-11', category: 'External Webhooks', name: 'Custom POS & ERP Business Ingestion API', status: 'Developer Preview', mockActive: true, sampleFrequency: 'Event-driven', description: 'Webhooks for connecting custom business sales logs to match trends with actual transaction velocity.' },
];
