export interface Package {
  name: string;
  price: number;
  features?: string[];
}

export interface Addon {
  name: string;
  price: number;
}

export interface SeedService {
  id: string;
  title: string;
  description: string;
  category: string;
  packages: Package[];
  addons?: Addon[];
  isActive: boolean;
  isVisible: boolean;
}

export const seedServices: SeedService[] = [
  // ── SOCIAL MEDIA MANAGEMENT ──────────────────────────────────────────────
  {
    id: 'svc-001',
    title: 'Social Media Management – Starter',
    description: 'Basic social media management for small businesses. Includes content planning, posting, and monthly reporting.',
    category: 'Social Media',
    packages: [
      { name: 'Starter', price: 8000, features: ['3 platforms', '12 posts/month', 'Monthly report'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-002',
    title: 'Social Media Management – Growth',
    description: 'Comprehensive social media management with engagement, stories, and bi-weekly reporting.',
    category: 'Social Media',
    packages: [
      { name: 'Growth', price: 15000, features: ['4 platforms', '20 posts/month', 'Stories', 'Bi-weekly report'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-003',
    title: 'Social Media Management – Pro',
    description: 'Full-service social media management with reels, influencer coordination, and weekly reporting.',
    category: 'Social Media',
    packages: [
      { name: 'Pro', price: 25000, features: ['5 platforms', '30 posts/month', 'Reels', 'Influencer coordination', 'Weekly report'] },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── SEO ──────────────────────────────────────────────────────────────────
  {
    id: 'svc-004',
    title: 'SEO – Basic',
    description: 'On-page SEO optimization, keyword research, and monthly ranking report for up to 10 keywords.',
    category: 'SEO',
    packages: [
      { name: 'Basic', price: 6000, features: ['10 keywords', 'On-page SEO', 'Monthly report'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-005',
    title: 'SEO – Standard',
    description: 'Comprehensive SEO with on-page, off-page, technical audit, and link building for up to 25 keywords.',
    category: 'SEO',
    packages: [
      { name: 'Standard', price: 12000, features: ['25 keywords', 'On-page + Off-page', 'Technical audit', 'Link building'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-006',
    title: 'SEO – Enterprise',
    description: 'Enterprise-grade SEO with unlimited keywords, dedicated account manager, and weekly reporting.',
    category: 'SEO',
    packages: [
      { name: 'Enterprise', price: 25000, features: ['Unlimited keywords', 'Dedicated manager', 'Weekly report', 'Competitor analysis'] },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── PAID ADS ─────────────────────────────────────────────────────────────
  {
    id: 'svc-007',
    title: 'Google Ads Management',
    description: 'Setup and management of Google Search, Display, and Shopping campaigns with monthly optimization.',
    category: 'Paid Ads',
    packages: [
      { name: 'Starter', price: 8000, features: ['Campaign setup', 'Monthly optimization', 'Performance report'] },
      { name: 'Growth', price: 15000, features: ['Multiple campaigns', 'Bi-weekly optimization', 'A/B testing'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-008',
    title: 'Meta Ads Management',
    description: 'Facebook and Instagram paid advertising with audience targeting, creative strategy, and reporting.',
    category: 'Paid Ads',
    packages: [
      { name: 'Starter', price: 7000, features: ['FB + IG ads', 'Audience targeting', 'Monthly report'] },
      { name: 'Growth', price: 14000, features: ['Retargeting', 'Lookalike audiences', 'Creative strategy'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-009',
    title: 'LinkedIn Ads Management',
    description: 'B2B LinkedIn advertising for lead generation, brand awareness, and event promotion.',
    category: 'Paid Ads',
    packages: [
      { name: 'Standard', price: 12000, features: ['Lead gen forms', 'Sponsored content', 'Monthly report'] },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── CONTENT MARKETING ────────────────────────────────────────────────────
  {
    id: 'svc-010',
    title: 'Blog Writing – Starter',
    description: 'SEO-optimized blog articles written by expert content writers. 4 articles per month.',
    category: 'Content Marketing',
    packages: [
      { name: 'Starter', price: 5000, features: ['4 articles/month', 'SEO optimized', '800–1000 words each'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-011',
    title: 'Blog Writing – Growth',
    description: 'High-quality long-form blog content with keyword research and internal linking. 8 articles per month.',
    category: 'Content Marketing',
    packages: [
      { name: 'Growth', price: 9000, features: ['8 articles/month', 'Long-form content', 'Keyword research', 'Internal linking'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-012',
    title: 'Video Script Writing',
    description: 'Professional video scripts for YouTube, reels, ads, and explainer videos.',
    category: 'Content Marketing',
    packages: [
      { name: 'Basic', price: 3000, features: ['2 scripts/month', 'Up to 5 min each'] },
      { name: 'Pro', price: 7000, features: ['5 scripts/month', 'Up to 10 min each', 'Storyboard notes'] },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── EMAIL MARKETING ───────────────────────────────────────────────────────
  {
    id: 'svc-013',
    title: 'Email Marketing – Starter',
    description: 'Monthly email newsletter design, copywriting, and campaign management for up to 2,000 subscribers.',
    category: 'Email Marketing',
    packages: [
      { name: 'Starter', price: 4000, features: ['2 campaigns/month', 'Up to 2,000 subscribers', 'Template design'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-014',
    title: 'Email Marketing – Growth',
    description: 'Advanced email marketing with automation sequences, segmentation, and A/B testing.',
    category: 'Email Marketing',
    packages: [
      { name: 'Growth', price: 9000, features: ['4 campaigns/month', 'Automation sequences', 'Segmentation', 'A/B testing'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-015',
    title: 'Email Marketing – Enterprise',
    description: 'Full-service email marketing with drip campaigns, CRM integration, and dedicated account manager.',
    category: 'Email Marketing',
    packages: [
      { name: 'Enterprise', price: 18000, features: ['Unlimited campaigns', 'Drip sequences', 'CRM integration', 'Dedicated manager'] },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── WEBSITE DEVELOPMENT ───────────────────────────────────────────────────
  {
    id: 'svc-016',
    title: 'Landing Page Design',
    description: 'High-converting landing page design and development with mobile responsiveness and CTA optimization.',
    category: 'Web Development',
    packages: [
      { name: 'Basic', price: 12000, features: ['1 landing page', 'Mobile responsive', 'CTA optimization', '2 revisions'] },
      { name: 'Pro', price: 20000, features: ['1 landing page', 'A/B test variant', 'Analytics integration', '5 revisions'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-017',
    title: 'Business Website Development',
    description: 'Professional 5–10 page business website with CMS, contact forms, and SEO setup.',
    category: 'Web Development',
    packages: [
      { name: 'Standard', price: 35000, features: ['5–10 pages', 'CMS integration', 'Contact forms', 'Basic SEO'] },
      { name: 'Premium', price: 60000, features: ['Up to 20 pages', 'E-commerce ready', 'Advanced SEO', 'Speed optimization'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-018',
    title: 'E-Commerce Website',
    description: 'Full-featured e-commerce website with product catalog, payment gateway, and order management.',
    category: 'Web Development',
    packages: [
      { name: 'Starter', price: 50000, features: ['Up to 50 products', 'Payment gateway', 'Order management', 'Mobile responsive'] },
      { name: 'Growth', price: 90000, features: ['Unlimited products', 'Multi-payment', 'Inventory management', 'Analytics'] },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── GRAPHIC DESIGN ────────────────────────────────────────────────────────
  {
    id: 'svc-019',
    title: 'Brand Identity Design',
    description: 'Complete brand identity including logo, color palette, typography, and brand guidelines.',
    category: 'Graphic Design',
    packages: [
      { name: 'Basic', price: 8000, features: ['Logo design', 'Color palette', 'Typography', '3 concepts'] },
      { name: 'Premium', price: 18000, features: ['Full brand kit', 'Business card', 'Letterhead', 'Brand guidelines doc'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-020',
    title: 'Social Media Graphics Pack',
    description: 'Custom social media graphic templates for posts, stories, and covers across all platforms.',
    category: 'Graphic Design',
    packages: [
      { name: 'Starter', price: 4000, features: ['10 post templates', '5 story templates', 'Editable files'] },
      { name: 'Pro', price: 8000, features: ['20 post templates', '10 story templates', 'Cover designs', 'Editable files'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-021',
    title: 'Brochure & Flyer Design',
    description: 'Professional print and digital brochure and flyer design for marketing campaigns.',
    category: 'Graphic Design',
    packages: [
      { name: 'Single', price: 2500, features: ['1 design', '2 revisions', 'Print-ready file'] },
      { name: 'Pack', price: 6000, features: ['3 designs', '3 revisions each', 'Print + digital files'] },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── VIDEO PRODUCTION ──────────────────────────────────────────────────────
  {
    id: 'svc-022',
    title: 'Reels & Short Video Editing',
    description: 'Professional editing of Instagram Reels, YouTube Shorts, and TikTok videos with captions and music.',
    category: 'Video Production',
    packages: [
      { name: 'Basic', price: 3000, features: ['4 videos/month', 'Captions', 'Music sync'] },
      { name: 'Pro', price: 7000, features: ['10 videos/month', 'Motion graphics', 'Captions', 'Thumbnail design'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-023',
    title: 'Corporate Video Production',
    description: 'End-to-end corporate video production including scripting, shooting, and post-production.',
    category: 'Video Production',
    packages: [
      { name: 'Standard', price: 25000, features: ['Up to 3 min video', 'Script', 'Shoot', 'Post-production'] },
      { name: 'Premium', price: 50000, features: ['Up to 5 min video', 'Multiple locations', 'Professional crew', 'Color grading'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-024',
    title: 'Explainer Video (Animated)',
    description: 'Animated explainer videos for products, services, and onboarding with voiceover.',
    category: 'Video Production',
    packages: [
      { name: 'Basic', price: 15000, features: ['Up to 60 sec', 'Script', 'Animation', 'Voiceover'] },
      { name: 'Pro', price: 30000, features: ['Up to 2 min', 'Custom characters', 'Professional voiceover', 'Music'] },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── AUTOMATION & AI ───────────────────────────────────────────────────────
  {
    id: 'svc-025',
    title: 'WhatsApp Business Automation',
    description: 'Set up WhatsApp Business API with automated replies, chatbot flows, and lead capture.',
    category: 'Automation & AI',
    packages: [
      { name: 'Basic', price: 10000, features: ['Chatbot setup', 'Auto-reply flows', 'Lead capture'] },
      { name: 'Advanced', price: 20000, features: ['CRM integration', 'Multi-agent support', 'Analytics dashboard'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-026',
    title: 'CRM Setup & Automation',
    description: 'Setup and configure CRM with automated lead nurturing, pipeline management, and reporting.',
    category: 'Automation & AI',
    packages: [
      { name: 'Starter', price: 12000, features: ['CRM setup', 'Lead pipeline', 'Basic automation'] },
      { name: 'Pro', price: 25000, features: ['Advanced automation', 'Email sequences', 'Reporting dashboard', 'Training'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-027',
    title: 'AI Chatbot Development',
    description: 'Custom AI-powered chatbot for website, WhatsApp, or social media with NLP capabilities.',
    category: 'Automation & AI',
    packages: [
      { name: 'Basic', price: 18000, features: ['FAQ chatbot', 'Lead capture', 'Website integration'] },
      { name: 'Advanced', price: 40000, features: ['NLP-powered', 'Multi-platform', 'CRM integration', 'Analytics'] },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── LEAD GENERATION ───────────────────────────────────────────────────────
  {
    id: 'svc-028',
    title: 'Lead Generation – Starter',
    description: 'Targeted lead generation using LinkedIn, email outreach, and landing pages.',
    category: 'Lead Generation',
    packages: [
      { name: 'Starter', price: 10000, features: ['50 leads/month', 'LinkedIn outreach', 'Email campaigns'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-029',
    title: 'Lead Generation – Growth',
    description: 'Multi-channel lead generation with paid ads, SEO, and content marketing integration.',
    category: 'Lead Generation',
    packages: [
      { name: 'Growth', price: 20000, features: ['150 leads/month', 'Multi-channel', 'Paid ads', 'Lead scoring'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-030',
    title: 'B2B Lead Generation',
    description: 'Specialized B2B lead generation with account-based marketing and decision-maker targeting.',
    category: 'Lead Generation',
    packages: [
      { name: 'Standard', price: 30000, features: ['100 qualified leads', 'ABM strategy', 'Decision-maker targeting', 'CRM integration'] },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── REPUTATION MANAGEMENT ─────────────────────────────────────────────────
  {
    id: 'svc-031',
    title: 'Online Reputation Management',
    description: 'Monitor, manage, and improve your online reputation across Google, social media, and review platforms.',
    category: 'Reputation Management',
    packages: [
      { name: 'Basic', price: 8000, features: ['Review monitoring', 'Response management', 'Monthly report'] },
      { name: 'Pro', price: 18000, features: ['Multi-platform', 'Crisis management', 'Sentiment analysis', 'Weekly report'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-032',
    title: 'Google My Business Optimization',
    description: 'Complete GMB profile optimization, post management, and review response service.',
    category: 'Reputation Management',
    packages: [
      { name: 'Standard', price: 5000, features: ['Profile optimization', '8 posts/month', 'Review responses', 'Q&A management'] },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── ANALYTICS & REPORTING ─────────────────────────────────────────────────
  {
    id: 'svc-033',
    title: 'Marketing Analytics Setup',
    description: 'Setup Google Analytics 4, Tag Manager, and custom dashboards for comprehensive marketing tracking.',
    category: 'Analytics',
    packages: [
      { name: 'Basic', price: 8000, features: ['GA4 setup', 'Tag Manager', 'Basic dashboard'] },
      { name: 'Advanced', price: 18000, features: ['Custom dashboards', 'Conversion tracking', 'Attribution modeling', 'Training'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-034',
    title: 'Monthly Marketing Report',
    description: 'Comprehensive monthly marketing performance report with insights and recommendations.',
    category: 'Analytics',
    packages: [
      { name: 'Standard', price: 5000, features: ['All channels', 'KPI tracking', 'Insights & recommendations', 'Executive summary'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-035',
    title: 'Competitor Analysis Report',
    description: 'In-depth competitor analysis covering SEO, social media, ads, and content strategy.',
    category: 'Analytics',
    packages: [
      { name: 'Standard', price: 7000, features: ['5 competitors', 'SEO analysis', 'Social media audit', 'Ad strategy review'] },
      { name: 'Premium', price: 15000, features: ['10 competitors', 'Full digital audit', 'SWOT analysis', 'Action plan'] },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── NEW SERVICES FROM PDF ─────────────────────────────────────────────────

  // Digital Marketing Services
  {
    id: 'svc-036',
    title: 'Digital Marketing Strategy Consultation',
    description: 'One-on-one strategy session to build a customized digital marketing roadmap for your business.',
    category: 'Digital Marketing',
    packages: [
      { name: 'Single Session', price: 5000, features: ['2-hour consultation', 'Custom roadmap', 'Action plan document'] },
      { name: 'Monthly Retainer', price: 15000, features: ['4 sessions/month', 'Ongoing strategy', 'Priority support'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-037',
    title: 'Performance Marketing',
    description: 'Data-driven performance marketing campaigns focused on measurable ROI across all digital channels.',
    category: 'Digital Marketing',
    packages: [
      { name: 'Starter', price: 12000, features: ['Campaign setup', 'ROI tracking', 'Monthly optimization'] },
      { name: 'Growth', price: 25000, features: ['Multi-channel', 'Advanced tracking', 'Weekly optimization', 'Dedicated manager'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-038',
    title: 'Influencer Marketing Campaign',
    description: 'End-to-end influencer marketing including identification, outreach, campaign management, and reporting.',
    category: 'Digital Marketing',
    packages: [
      { name: 'Micro Influencers', price: 20000, features: ['5 micro-influencers', 'Campaign brief', 'Content approval', 'Report'] },
      { name: 'Macro Influencers', price: 50000, features: ['2 macro-influencers', 'Full campaign management', 'Analytics report'] },
    ],
    isActive: true,
    isVisible: true,
  },

  // WhatsApp Marketing
  {
    id: 'svc-039',
    title: 'WhatsApp Marketing Campaign',
    description: 'Bulk WhatsApp marketing campaigns with personalized messaging, media, and tracking.',
    category: 'WhatsApp Marketing',
    packages: [
      { name: 'Basic', price: 5000, features: ['Up to 1,000 contacts', 'Text + media messages', 'Delivery report'] },
      { name: 'Pro', price: 12000, features: ['Up to 5,000 contacts', 'Personalized messages', 'Click tracking', 'Analytics'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-040',
    title: 'WhatsApp Broadcast Setup',
    description: 'Setup and manage WhatsApp broadcast lists for regular customer communication and promotions.',
    category: 'WhatsApp Marketing',
    packages: [
      { name: 'Setup', price: 3000, features: ['Broadcast list setup', 'Message templates', 'Training'] },
      { name: 'Managed', price: 8000, features: ['Monthly management', '8 broadcasts/month', 'Performance report'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-041',
    title: 'WhatsApp Catalogue Setup',
    description: 'Set up and optimize your WhatsApp Business product catalogue for seamless customer shopping.',
    category: 'WhatsApp Marketing',
    packages: [
      { name: 'Standard', price: 4000, features: ['Up to 50 products', 'Product descriptions', 'Image optimization', 'Category setup'] },
    ],
    isActive: true,
    isVisible: true,
  },

  // Photography & Videography
  {
    id: 'svc-042',
    title: 'Product Photography',
    description: 'Professional product photography for e-commerce, catalogues, and social media with editing.',
    category: 'Photography & Videography',
    packages: [
      { name: 'Basic', price: 5000, features: ['10 products', 'White background', 'Basic editing', 'Digital delivery'] },
      { name: 'Premium', price: 12000, features: ['25 products', 'Lifestyle shots', 'Advanced editing', 'Multiple angles'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-043',
    title: 'Brand Photography Session',
    description: 'Professional brand photography session for website, social media, and marketing materials.',
    category: 'Photography & Videography',
    packages: [
      { name: 'Half Day', price: 8000, features: ['4-hour session', '50 edited photos', 'Multiple setups', 'Digital delivery'] },
      { name: 'Full Day', price: 15000, features: ['8-hour session', '100 edited photos', 'Multiple locations', 'Rush delivery'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-044',
    title: 'Social Media Video Shoot',
    description: 'Dedicated video shoot for social media content including reels, stories, and promotional videos.',
    category: 'Photography & Videography',
    packages: [
      { name: 'Basic', price: 10000, features: ['4-hour shoot', '5 edited videos', 'Basic color grading'] },
      { name: 'Pro', price: 20000, features: ['8-hour shoot', '10 edited videos', 'Color grading', 'Motion graphics'] },
    ],
    isActive: true,
    isVisible: true,
  },

  // Event Marketing
  {
    id: 'svc-045',
    title: 'Event Promotion & Marketing',
    description: 'Complete event marketing including social media promotion, email campaigns, and paid ads.',
    category: 'Event Marketing',
    packages: [
      { name: 'Basic', price: 15000, features: ['Social media promotion', 'Email campaign', 'Event page design'] },
      { name: 'Full Package', price: 35000, features: ['Multi-channel promotion', 'Paid ads', 'PR outreach', 'Post-event report'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-046',
    title: 'Virtual Event Management',
    description: 'End-to-end virtual event management including platform setup, promotion, and live support.',
    category: 'Event Marketing',
    packages: [
      { name: 'Standard', price: 20000, features: ['Platform setup', 'Registration page', 'Email reminders', 'Live support'] },
      { name: 'Premium', price: 45000, features: ['Custom platform', 'Full promotion', 'Recording & editing', 'Post-event analytics'] },
    ],
    isActive: true,
    isVisible: true,
  },

  // PR & Communications
  {
    id: 'svc-047',
    title: 'Press Release Writing & Distribution',
    description: 'Professional press release writing and distribution to relevant media outlets and journalists.',
    category: 'PR & Communications',
    packages: [
      { name: 'Basic', price: 5000, features: ['1 press release', 'Writing & editing', '20 media outlets'] },
      { name: 'Pro', price: 12000, features: ['2 press releases', 'Premium distribution', '50+ media outlets', 'Follow-up'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-048',
    title: 'Media Coverage & PR Campaign',
    description: 'Strategic PR campaign to secure media coverage, interviews, and brand mentions.',
    category: 'PR & Communications',
    packages: [
      { name: 'Starter', price: 20000, features: ['Media list building', 'Pitch writing', '3 guaranteed placements'] },
      { name: 'Growth', price: 45000, features: ['Ongoing PR', '8 placements/month', 'Crisis management', 'Monthly report'] },
    ],
    isActive: true,
    isVisible: true,
  },

  // Training & Workshops
  {
    id: 'svc-049',
    title: 'Digital Marketing Training',
    description: 'Comprehensive digital marketing training for teams covering SEO, social media, ads, and analytics.',
    category: 'Training & Workshops',
    packages: [
      { name: 'Half Day Workshop', price: 8000, features: ['4-hour session', 'Up to 10 participants', 'Training material', 'Certificate'] },
      { name: 'Full Day Workshop', price: 15000, features: ['8-hour session', 'Up to 20 participants', 'Hands-on exercises', 'Certificate'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-050',
    title: 'Social Media Marketing Masterclass',
    description: 'In-depth social media marketing masterclass covering content strategy, growth hacking, and monetization.',
    category: 'Training & Workshops',
    packages: [
      { name: 'Online', price: 3000, features: ['Self-paced', 'Video lessons', 'Workbook', 'Certificate'] },
      { name: 'Live Batch', price: 8000, features: ['Live sessions', 'Q&A', 'Community access', 'Certificate'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-051',
    title: 'Personal Branding Coaching',
    description: 'One-on-one personal branding coaching to build your professional presence online.',
    category: 'Training & Workshops',
    packages: [
      { name: 'Starter', price: 5000, features: ['3 sessions', 'Brand audit', 'LinkedIn optimization', 'Content plan'] },
      { name: 'Pro', price: 12000, features: ['8 sessions', 'Full brand strategy', 'Content creation support', 'Monthly check-in'] },
    ],
    isActive: true,
    isVisible: true,
  },

  // App & Software Marketing
  {
    id: 'svc-052',
    title: 'App Store Optimization (ASO)',
    description: 'Optimize your mobile app listing on Google Play and App Store for maximum visibility and downloads.',
    category: 'App Marketing',
    packages: [
      { name: 'Basic', price: 6000, features: ['Keyword research', 'Title & description', 'Screenshot design', 'Monthly report'] },
      { name: 'Pro', price: 14000, features: ['Full ASO audit', 'A/B testing', 'Review management', 'Competitor analysis'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-053',
    title: 'Mobile App Marketing Campaign',
    description: 'Comprehensive mobile app marketing including paid user acquisition, ASO, and retention campaigns.',
    category: 'App Marketing',
    packages: [
      { name: 'Launch Package', price: 25000, features: ['Launch strategy', 'Paid UA campaigns', 'ASO', 'PR outreach'] },
      { name: 'Growth Package', price: 50000, features: ['Ongoing UA', 'Retargeting', 'Push notification strategy', 'Analytics'] },
    ],
    isActive: true,
    isVisible: true,
  },

  // E-Commerce Marketing
  {
    id: 'svc-054',
    title: 'E-Commerce Marketing – Starter',
    description: 'Complete e-commerce marketing setup including product ads, email flows, and social media.',
    category: 'E-Commerce Marketing',
    packages: [
      { name: 'Starter', price: 15000, features: ['Product ads setup', 'Email welcome flow', 'Social media management', 'Monthly report'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-055',
    title: 'E-Commerce Marketing – Growth',
    description: 'Advanced e-commerce marketing with abandoned cart recovery, upsell campaigns, and loyalty programs.',
    category: 'E-Commerce Marketing',
    packages: [
      { name: 'Growth', price: 30000, features: ['Abandoned cart recovery', 'Upsell campaigns', 'Loyalty program', 'Advanced analytics'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-056',
    title: 'Amazon / Flipkart Marketplace Marketing',
    description: 'Optimize and market your products on Amazon and Flipkart with sponsored ads and listing optimization.',
    category: 'E-Commerce Marketing',
    packages: [
      { name: 'Basic', price: 8000, features: ['Listing optimization', 'Keyword research', 'Sponsored ads setup'] },
      { name: 'Pro', price: 18000, features: ['Full marketplace management', 'A+ content', 'Review strategy', 'Monthly report'] },
    ],
    isActive: true,
    isVisible: true,
  },

  // Local Marketing
  {
    id: 'svc-057',
    title: 'Local SEO & Marketing',
    description: 'Dominate local search results with GMB optimization, local citations, and geo-targeted campaigns.',
    category: 'Local Marketing',
    packages: [
      { name: 'Basic', price: 6000, features: ['GMB optimization', 'Local citations', 'Review management'] },
      { name: 'Pro', price: 14000, features: ['Local SEO', 'Geo-targeted ads', 'Hyperlocal content', 'Monthly report'] },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: 'svc-058',
    title: 'Hyperlocal Social Media Marketing',
    description: 'Targeted social media marketing for local businesses to reach customers in specific areas.',
    category: 'Local Marketing',
    packages: [
      { name: 'Standard', price: 8000, features: ['Location-based targeting', 'Local content creation', 'Community engagement', 'Monthly report'] },
    ],
    isActive: true,
    isVisible: true,
  },
];
