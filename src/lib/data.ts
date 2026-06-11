// ============================================
// DUMMY DATA API - Central data source
// ============================================

export type Article = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  views: string;
  status: 'Published' | 'Draft';
  tags: string[];
  featured: boolean;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  count: number;
  color: string;
};

export type MediaFile = {
  id: number;
  name: string;
  size: string;
  date: string;
  type: string;
};

// ------- CATEGORIES -------
export const categories: Category[] = [
  { id: 1, name: 'National', slug: 'national', count: 42, color: '#e50914' },
  { id: 2, name: 'Crime', slug: 'crime', count: 31, color: '#7c3aed' },
  { id: 3, name: 'Sports', slug: 'sports', count: 56, color: '#10b981' },
  { id: 4, name: 'Education', slug: 'education', count: 28, color: '#3b82f6' },
  { id: 5, name: 'Political', slug: 'political', count: 64, color: '#f59e0b' },
  { id: 6, name: 'Religious', slug: 'religious', count: 19, color: '#ec4899' },
  { id: 7, name: 'Social', slug: 'social', count: 37, color: '#06b6d4' },
];

// ------- ARTICLES -------
export const articles: Article[] = [
  {
    id: 1, slug: 'major-policy-shift-announced-by-government',
    title: 'Major Policy Shift Announced by Government Targets Economic Growth',
    excerpt: 'In a surprising move, the central administration has unveiled a comprehensive package designed to stimulate local manufacturing and tech sectors.',
    content: `<p><strong style="font-size:1.3rem;float:left;line-height:1;padding-right:0.5rem;color:var(--primary-color)">N</strong>ew Delhi: In a massive development that has sent ripples through the political landscape, the central government has announced a sweeping policy shift aimed at revitalizing economic growth across all sectors. The announcement came during a special session of Parliament, where the Finance Minister outlined a multi-pronged approach to tackle unemployment and boost GDP growth.</p>
<p>The package, estimated to be worth over ₹5 lakh crore, includes significant tax incentives for startups, reduced compliance burdens for small businesses, and a new digital infrastructure fund that will support the rollout of next-generation technologies in rural areas.</p>
<h2>Key Highlights of the Policy</h2>
<p>Among the most notable provisions is the creation of 50 new industrial corridors connecting Tier-2 and Tier-3 cities to major metropolitan hubs. This initiative is expected to create over 2 million direct jobs within the first three years of implementation.</p>
<blockquote>"This is not just a policy change; it is a paradigm shift in how we view the intersection of technology and local commerce." — Finance Minister</blockquote>
<p>Industry leaders have largely welcomed the move, with the head of the National Chambers of Commerce calling it "the most progressive economic reform in a decade." However, opposition parties have raised concerns about the fiscal deficit implications and potential inflationary pressures.</p>
<p>Markets responded positively to the announcement, with the benchmark index surging over 2.3% in early trading. The technology and manufacturing sectors led the rally, with several blue-chip stocks hitting 52-week highs.</p>`,
    category: 'National', author: 'Rajesh Kumar', date: 'May 11, 2026', readTime: '5 min', views: '45.2K', status: 'Published', tags: ['Economy', 'Government', 'Breaking'], featured: true,
  },
  {
    id: 2, slug: 'opposition-leader-responds-to-economic-package',
    title: 'Opposition Leader Responds to New Economic Package with Sharp Criticism',
    excerpt: 'The Leader of Opposition called the economic package a "publicity stunt" and demanded a parliamentary debate.',
    content: `<p>Parliament was the scene of heated exchanges today as the Leader of Opposition responded sharply to the government's newly announced economic package, calling it "a well-crafted publicity stunt designed to distract from real issues."</p>
<p>In a fiery speech that lasted nearly 45 minutes, the opposition leader questioned the fiscal viability of the proposals and demanded detailed cost breakdowns. "Where is the money going to come from?" he thundered, waving a stack of documents that he claimed showed the government's track record of unfulfilled promises.</p>
<h2>Point-by-Point Rebuttal</h2>
<p>The opposition presented a detailed analysis suggesting that similar packages in the past had only achieved 30% of their stated objectives. They also raised concerns about potential job losses in traditional manufacturing sectors that might be displaced by the digital-first approach.</p>
<p>Political analysts suggest this marks the beginning of what could be a prolonged parliamentary battle over economic policy heading into the next election cycle.</p>`,
    category: 'Political', author: 'Priya Sharma', date: 'May 11, 2026', readTime: '4 min', views: '32.1K', status: 'Published', tags: ['Opposition', 'Parliament', 'Economy'], featured: false,
  },
  {
    id: 3, slug: 'local-team-secures-championship-victory',
    title: 'Local Team Secures Championship Victory in Final Minutes of Thrilling Match',
    excerpt: 'A last-minute goal sealed an unforgettable championship win for the home team in front of 60,000 fans.',
    content: `<p>In what is being called one of the greatest sporting moments in the city's history, the local football club clinched the national championship title with a dramatic last-minute goal that sent the stadium into a frenzy.</p>
<p>Trailing 1-2 with just three minutes of regular time remaining, striker Vikram Singh produced a moment of pure magic, collecting a long ball on his chest before firing an unstoppable shot into the top corner from 25 yards out. The equalizer set the stage for a breathtaking finish.</p>
<h2>The Winning Moment</h2>
<p>Deep into injury time, midfielder Arjun Patel found himself unmarked at the edge of the box after a perfectly executed set-piece routine. His precise left-footed strike found the bottom corner, triggering wild celebrations both on and off the pitch.</p>
<p>"This is for every fan who believed in us when nobody else did," an emotional team captain said during the post-match ceremony. The victory parade through the city center is scheduled for tomorrow, with millions expected to line the streets.</p>`,
    category: 'Sports', author: 'Amit Verma', date: 'May 10, 2026', readTime: '3 min', views: '78.5K', status: 'Published', tags: ['Football', 'Championship', 'Sports'], featured: true,
  },
  {
    id: 4, slug: 'authorities-crack-down-on-organized-syndicate',
    title: 'Local Authorities Crack Down on Organized Crime Syndicate in Multi-State Operation',
    excerpt: 'A coordinated police operation across five states resulted in the arrest of 23 suspects linked to a major criminal network.',
    content: `<p>In one of the largest law enforcement operations in recent memory, police across five states simultaneously raided over 40 locations linked to a sprawling organized crime syndicate that had been operating undetected for nearly a decade.</p>
<p>The early morning operation, codenamed "Operation Clean Sweep," resulted in the arrest of 23 key suspects, including the alleged kingpin who was apprehended at a farmhouse on the outskirts of the city. Police also seized assets worth an estimated ₹200 crore, including luxury vehicles, property documents, and large quantities of cash.</p>
<h2>The Investigation</h2>
<p>According to the Special Task Force commander, the investigation had been ongoing for 18 months, involving extensive surveillance and intelligence gathering from both national and international agencies.</p>
<p>"This syndicate had its tentacles in everything from real estate fraud to illegal mining and money laundering," the commander told reporters. "Today's operation deals a significant blow to organized crime in the region."</p>`,
    category: 'Crime', author: 'Suresh Reddy', date: 'May 09, 2026', readTime: '6 min', views: '56.3K', status: 'Published', tags: ['Crime', 'Police', 'Investigation'], featured: false,
  },
  {
    id: 5, slug: 'new-education-policy-transforms-curriculum',
    title: 'New Education Policy Set to Transform National Curriculum from Next Academic Session',
    excerpt: 'The Ministry of Education announced sweeping changes that will replace the existing framework with a competency-based model.',
    content: `<p>The Ministry of Education has officially unveiled the implementation roadmap for the new National Education Policy, which promises to fundamentally reshape how millions of students learn across the country starting from the next academic session.</p>
<p>The new policy introduces a competency-based learning model that moves away from rote memorization toward critical thinking, creativity, and practical skill development. Key changes include the integration of coding and AI literacy from Class 6, the introduction of flexible subject combinations in higher secondary, and a complete overhaul of the examination system.</p>
<h2>What Changes for Students</h2>
<p>Students will now have the freedom to choose subjects across streams, breaking the traditional rigid boundaries between Science, Commerce, and Humanities. A new credit-based system will allow students to accumulate credits across multiple disciplines.</p>
<p>Education experts have largely praised the forward-looking approach, though concerns remain about teacher training and infrastructure readiness, particularly in rural areas.</p>`,
    category: 'Education', author: 'Dr. Meera Joshi', date: 'May 08, 2026', readTime: '5 min', views: '34.7K', status: 'Published', tags: ['Education', 'Policy', 'Curriculum'], featured: false,
  },
  {
    id: 6, slug: 'temple-festival-draws-millions-of-devotees',
    title: 'Annual Temple Festival Draws Millions of Devotees from Across the Nation',
    excerpt: 'The week-long religious festival saw record attendance with elaborate rituals and cultural performances.',
    content: `<p>The ancient temple in the heart of the city witnessed an unprecedented gathering of devotees as the annual religious festival kicked off with grand celebrations that are expected to continue for an entire week.</p>
<p>Authorities estimated that over 2 million pilgrims visited the temple complex on the opening day alone, making it the highest single-day attendance in the festival's 800-year history. Elaborate security arrangements, including drone surveillance and AI-powered crowd management systems, were deployed to ensure the safety of visitors.</p>
<h2>Cultural Significance</h2>
<p>The festival holds deep spiritual significance and features a series of traditional rituals performed by senior priests. This year's celebrations also include a special interfaith prayer ceremony promoting communal harmony.</p>
<p>Local businesses and hospitality services reported a massive surge in demand, with hotels across the city operating at full capacity for the entire festival week.</p>`,
    category: 'Religious', author: 'Kavitha Nair', date: 'May 07, 2026', readTime: '4 min', views: '28.9K', status: 'Published', tags: ['Festival', 'Religion', 'Culture'], featured: false,
  },
  {
    id: 7, slug: 'community-initiative-bridges-digital-divide',
    title: 'Community Initiative Bridges Digital Divide with Free Internet and Training Centers',
    excerpt: 'A grassroots movement has established 200 digital literacy centers in underserved neighborhoods.',
    content: `<p>A remarkable grassroots initiative has successfully established over 200 digital literacy centers across underserved neighborhoods, providing free internet access and computer training to thousands of residents who previously had no digital connectivity.</p>
<p>The initiative, launched by a coalition of NGOs and tech volunteers, has already trained over 15,000 people in basic digital skills, from using email and online banking to accessing government services and e-commerce platforms.</p>
<h2>Impact on Communities</h2>
<p>"Before this center opened, I had never used a computer in my life," said 62-year-old Kamala Devi, who now regularly video-calls her grandchildren studying abroad. "It has opened up a whole new world for me."</p>
<p>The project has attracted attention from the United Nations Development Programme, which has expressed interest in replicating the model in other developing nations.</p>`,
    category: 'Social', author: 'Ananya Gupta', date: 'May 06, 2026', readTime: '4 min', views: '21.4K', status: 'Published', tags: ['Community', 'Technology', 'Social'], featured: false,
  },
  {
    id: 8, slug: 'cricket-world-cup-squad-announced',
    title: 'National Cricket Team Squad Announced for Upcoming World Cup Campaign',
    excerpt: 'Selectors pick a balanced squad mixing experienced players with exciting young talent.',
    content: `<p>The national cricket selection committee has announced a 15-member squad for the upcoming World Cup, opting for a blend of battle-hardened veterans and dynamic young talent that signals a bold approach to the tournament.</p>
<p>The most notable inclusion is 19-year-old fast bowler Rohit Chauhan, whose express pace and aggressive bowling have made him one of the most exciting prospects in world cricket. Meanwhile, the return of senior all-rounder Ajay Mishra after a year-long injury layoff adds valuable experience.</p>
<h2>Squad Analysis</h2>
<p>Cricket analysts have largely praised the balanced composition, noting the emphasis on versatility with several multi-skilled players capable of batting and bowling effectively.</p>`,
    category: 'Sports', author: 'Amit Verma', date: 'May 05, 2026', readTime: '3 min', views: '92.1K', status: 'Published', tags: ['Cricket', 'World Cup', 'Sports'], featured: true,
  },
  {
    id: 9, slug: 'cybercrime-ring-busted-targeting-elderly',
    title: 'Major Cybercrime Ring Busted That Was Targeting Elderly Citizens Across the Country',
    excerpt: 'Police arrested 12 people operating a sophisticated phone and internet fraud scheme.',
    content: `<p>In a significant breakthrough, the cyber crime cell has dismantled a sophisticated fraud ring that had been systematically targeting elderly citizens through phone calls and fake websites, stealing over ₹50 crore in the process.</p>
<p>The gang operated by posing as bank officials, insurance agents, and even law enforcement officers, using social engineering techniques to extract sensitive financial information from their victims.</p>
<h2>How the Scam Worked</h2>
<p>Investigators revealed that the gang used a network of fake call centers operating across three cities, employing over 50 people who were trained to manipulate victims using scripted conversations designed to create panic and urgency.</p>`,
    category: 'Crime', author: 'Suresh Reddy', date: 'May 04, 2026', readTime: '5 min', views: '41.2K', status: 'Published', tags: ['Cybercrime', 'Fraud', 'Police'], featured: false,
  },
  {
    id: 10, slug: 'university-rankings-show-improvement',
    title: 'Indian Universities Show Dramatic Improvement in Global Rankings for 2026',
    excerpt: 'Five Indian institutions break into the global top 100 for the first time in history.',
    content: `<p>In a proud moment for the nation's higher education sector, five Indian universities have broken into the prestigious global top-100 rankings for the first time, marking a dramatic improvement driven by increased research output and international collaborations.</p>
<p>The annual World University Rankings placed IIT Delhi at 47th, IISc Bangalore at 52nd, and three other institutions in the 70-100 bracket. This represents a collective jump of over 30 positions compared to last year's rankings.</p>
<h2>Driving Factors</h2>
<p>Experts attribute the improvement to sustained government investment in research infrastructure, a significant increase in international faculty exchanges, and a growing culture of innovation-driven education that prioritizes real-world problem solving.</p>`,
    category: 'Education', author: 'Dr. Meera Joshi', date: 'May 03, 2026', readTime: '4 min', views: '27.8K', status: 'Published', tags: ['University', 'Rankings', 'Education'], featured: false,
  },
  {
    id: 11, slug: 'local-elections-heat-up-across-states',
    title: 'Local Elections Heat Up as Campaign Season Enters Final Phase Across Key States',
    excerpt: 'Political parties deploy top leaders and ramp up advertising as voters prepare to make their choice.',
    content: `<p>With just two weeks to go before polling day, the campaign trail across five key states has reached a fever pitch, with all major political parties pulling out all stops to woo voters in what analysts are calling the most closely contested local elections in a generation.</p>
<p>Star campaigners from national parties have been crisscrossing the states, holding multiple rallies daily and making a flurry of promises ranging from free electricity to universal healthcare. Social media campaigns have also intensified, with parties spending record amounts on digital advertising.</p>`,
    category: 'Political', author: 'Priya Sharma', date: 'May 02, 2026', readTime: '6 min', views: '38.5K', status: 'Published', tags: ['Elections', 'Campaign', 'Politics'], featured: false,
  },
  {
    id: 12, slug: 'interfaith-harmony-summit-held',
    title: 'Historic Interfaith Harmony Summit Brings Religious Leaders Together for Peace',
    excerpt: 'Leaders from all major faiths gathered to sign a joint declaration promoting unity and tolerance.',
    content: `<p>In a historic gathering, religious leaders representing all major faiths came together at a landmark Interfaith Harmony Summit to sign a joint declaration promoting peace, unity, and mutual respect across communities.</p>
<p>The summit, attended by over 500 delegates from 30 countries, featured panel discussions, joint prayer sessions, and cultural exchanges aimed at building bridges between communities that have historically been divided.</p>`,
    category: 'Religious', author: 'Kavitha Nair', date: 'May 01, 2026', readTime: '3 min', views: '18.6K', status: 'Published', tags: ['Interfaith', 'Peace', 'Harmony'], featured: false,
  },
  {
    id: 13, slug: 'youth-mental-health-awareness-campaign',
    title: 'Youth Mental Health Awareness Campaign Reaches 10 Million Students Nationwide',
    excerpt: 'The government-backed initiative has trained 50,000 counselors and set up helplines in every district.',
    content: `<p>A nationwide mental health awareness campaign specifically targeting young people has reached a significant milestone, having now engaged with over 10 million students across schools and colleges in all states and union territories.</p>
<p>The campaign provides free counseling services, peer support networks, and digital resources designed to help young people identify and manage mental health challenges before they become severe.</p>`,
    category: 'Social', author: 'Ananya Gupta', date: 'Apr 30, 2026', readTime: '4 min', views: '25.3K', status: 'Published', tags: ['Mental Health', 'Youth', 'Awareness'], featured: false,
  },
  {
    id: 14, slug: 'flood-relief-operations-intensify',
    title: 'Flood Relief Operations Intensify as Water Levels Continue to Rise in Eastern States',
    excerpt: 'Army and NDRF teams rescue over 5,000 stranded people as heavy rains continue.',
    content: `<p>Relief and rescue operations have been scaled up dramatically across three eastern states as unprecedented rainfall continues to cause widespread flooding, displacing hundreds of thousands of residents and disrupting critical infrastructure.</p>`,
    category: 'National', author: 'Rajesh Kumar', date: 'Apr 29, 2026', readTime: '5 min', views: '62.0K', status: 'Published', tags: ['Flood', 'Relief', 'Natural Disaster'], featured: false,
  },
  {
    id: 15, slug: 'draft-article-upcoming-sports-event',
    title: 'Preview: What to Expect at the Upcoming Asian Games',
    excerpt: 'An analysis of India\'s chances at the upcoming Asian Games.',
    content: `<p>Draft content for the Asian Games preview article...</p>`,
    category: 'Sports', author: 'Amit Verma', date: 'May 11, 2026', readTime: '4 min', views: '-', status: 'Draft', tags: ['Asian Games', 'Preview'], featured: false,
  },
];

// ------- MEDIA FILES -------
export const mediaFiles: MediaFile[] = [
  { id: 1, name: 'parliament-session.jpg', size: '1.2 MB', date: 'May 11, 2026', type: 'image' },
  { id: 2, name: 'championship-celebration.png', size: '2.4 MB', date: 'May 10, 2026', type: 'image' },
  { id: 3, name: 'police-operation.jpg', size: '850 KB', date: 'May 09, 2026', type: 'image' },
  { id: 4, name: 'new-curriculum-launch.jpg', size: '1.5 MB', date: 'May 08, 2026', type: 'image' },
  { id: 5, name: 'temple-festival.png', size: '3.4 MB', date: 'May 07, 2026', type: 'image' },
  { id: 6, name: 'digital-literacy-center.jpg', size: '920 KB', date: 'May 06, 2026', type: 'image' },
  { id: 7, name: 'election-rally.jpg', size: '1.8 MB', date: 'May 05, 2026', type: 'image' },
  { id: 8, name: 'flood-rescue-ops.jpg', size: '2.1 MB', date: 'May 04, 2026', type: 'image' },
  { id: 9, name: 'cricket-squad-photo.png', size: '1.6 MB', date: 'May 03, 2026', type: 'image' },
  { id: 10, name: 'summit-group-photo.jpg', size: '980 KB', date: 'May 02, 2026', type: 'image' },
  { id: 11, name: 'breaking-news-banner.png', size: '450 KB', date: 'May 01, 2026', type: 'image' },
  { id: 12, name: 'cybercrime-infographic.jpg', size: '1.1 MB', date: 'Apr 30, 2026', type: 'image' },
];

// ------- HELPER FUNCTIONS -------
export function getArticlesByCategory(categorySlug: string): Article[] {
  const catName = categories.find(c => c.slug === categorySlug)?.name;
  return articles.filter(a => a.category === catName && a.status === 'Published');
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}

export function getFeaturedArticles(): Article[] {
  return articles.filter(a => a.featured && a.status === 'Published');
}

export function getLatestArticles(count: number = 10): Article[] {
  return articles.filter(a => a.status === 'Published').slice(0, count);
}

export function getRelatedArticles(currentSlug: string, category: string, count: number = 4): Article[] {
  return articles.filter(a => a.category === category && a.slug !== currentSlug && a.status === 'Published').slice(0, count);
}

export function getTrendingArticles(count: number = 5): Article[] {
  return [...articles].filter(a => a.status === 'Published').sort((a, b) => {
    const parseViews = (v: string) => parseFloat(v.replace('K', '')) * 1000;
    return parseViews(b.views) - parseViews(a.views);
  }).slice(0, count);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(c => c.slug === slug);
}
