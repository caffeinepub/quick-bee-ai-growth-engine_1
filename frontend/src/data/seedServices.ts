// Local type definitions (Lead/Service/Package/Addon no longer exported from backend)
export interface Package {
  tier: string;
  priceINR: bigint;
  features: string[];
}

export interface Addon {
  name: string;
  price: bigint;
}

export interface SeedService {
  name: string;
  category: string;
  description: string;
  packages: Package[];
  addons: Addon[];
  maintenancePlan: bigint;
  isVisible: boolean;
  sortOrder: bigint;
}

function pkg(tier: string, priceINR: number, features: string[]): Package {
  return { tier, priceINR: BigInt(priceINR), features };
}

function addon(name: string, price: number): Addon {
  return { name, price: BigInt(price) };
}

export const seedServices: SeedService[] = [
  // Web Dev (5)
  {
    name: 'Business Website',
    category: 'Web Dev',
    description: 'Professional multi-page business website with modern design and SEO optimization.',
    packages: [
      pkg('Student', 4999, ['5 Pages', 'Responsive Design', 'Basic SEO', 'Contact Form']),
      pkg('Business', 14999, ['10 Pages', 'Custom Design', 'Advanced SEO', 'CMS Integration', 'Analytics']),
      pkg('Premium', 29999, ['20 Pages', 'Premium Design', 'Full SEO Suite', 'CMS + Blog', 'Speed Optimization']),
      pkg('Enterprise', 59999, ['Unlimited Pages', 'Custom Development', 'Enterprise SEO', 'Multi-language', 'CDN Setup']),
    ],
    addons: [addon('SSL Certificate', 1999), addon('Domain Registration', 999), addon('Logo Design', 4999)],
    maintenancePlan: BigInt(2999),
    isVisible: true,
    sortOrder: BigInt(0),
  },
  {
    name: 'E-Commerce Store',
    category: 'Web Dev',
    description: 'Full-featured online store with payment gateway, inventory management, and order tracking.',
    packages: [
      pkg('Student', 9999, ['Up to 20 Products', 'Basic Payment Gateway', 'Order Management']),
      pkg('Business', 24999, ['Up to 100 Products', 'Multiple Payment Options', 'Inventory Management', 'Discount Codes']),
      pkg('Premium', 49999, ['Up to 500 Products', 'Advanced Analytics', 'Multi-currency', 'Abandoned Cart Recovery']),
      pkg('Enterprise', 99999, ['Unlimited Products', 'Custom Integrations', 'B2B Features', 'ERP Integration']),
    ],
    addons: [addon('Product Photography (10 items)', 4999), addon('Razorpay Setup', 2999), addon('WhatsApp Catalog', 3999)],
    maintenancePlan: BigInt(4999),
    isVisible: true,
    sortOrder: BigInt(1),
  },
  {
    name: 'Landing Page',
    category: 'Web Dev',
    description: 'High-converting landing page designed to capture leads and drive sales.',
    packages: [
      pkg('Student', 2999, ['1 Page', 'Lead Capture Form', 'Mobile Responsive']),
      pkg('Business', 7999, ['1 Page + Thank You', 'A/B Testing Ready', 'Analytics Integration', 'CRM Integration']),
      pkg('Premium', 14999, ['3 Landing Pages', 'Advanced Animations', 'Heatmap Integration', 'Conversion Optimization']),
      pkg('Enterprise', 29999, ['10 Landing Pages', 'Personalization', 'Multi-variant Testing', 'Full Analytics Suite']),
    ],
    addons: [addon('Copywriting', 3999), addon('Video Integration', 2999)],
    maintenancePlan: BigInt(1499),
    isVisible: true,
    sortOrder: BigInt(2),
  },
  {
    name: 'Portfolio Website',
    category: 'Web Dev',
    description: 'Stunning portfolio website to showcase your work and attract clients.',
    packages: [
      pkg('Student', 2499, ['5 Portfolio Items', 'Contact Form', 'Basic Design']),
      pkg('Business', 6999, ['20 Portfolio Items', 'Custom Design', 'Blog Section', 'SEO']),
      pkg('Premium', 12999, ['Unlimited Items', 'Premium Animations', 'Client Portal', 'Testimonials']),
      pkg('Enterprise', 24999, ['Custom Features', 'Multi-user', 'Advanced CMS', 'API Integration']),
    ],
    addons: [addon('Professional Photography', 5999), addon('Video Showreel', 7999)],
    maintenancePlan: BigInt(1999),
    isVisible: true,
    sortOrder: BigInt(3),
  },
  {
    name: 'WordPress Development',
    category: 'Web Dev',
    description: 'Custom WordPress website with premium themes, plugins, and performance optimization.',
    packages: [
      pkg('Student', 3999, ['Premium Theme', 'Basic Plugins', '5 Pages']),
      pkg('Business', 11999, ['Custom Theme', 'Advanced Plugins', '15 Pages', 'WooCommerce']),
      pkg('Premium', 22999, ['Fully Custom', 'Premium Plugins', 'Unlimited Pages', 'Speed Optimization']),
      pkg('Enterprise', 44999, ['Headless WordPress', 'Custom Plugins', 'Multi-site', 'Enterprise Security']),
    ],
    addons: [addon('Plugin Development', 4999), addon('Theme Customization', 3999)],
    maintenancePlan: BigInt(2499),
    isVisible: true,
    sortOrder: BigInt(4),
  },
  // App Dev (4)
  {
    name: 'Mobile App Development',
    category: 'App Dev',
    description: 'Native or cross-platform mobile app for iOS and Android with modern UI/UX.',
    packages: [
      pkg('Student', 19999, ['Basic App', '5 Screens', 'API Integration', 'App Store Submission']),
      pkg('Business', 49999, ['Standard App', '15 Screens', 'Push Notifications', 'Analytics', 'Admin Panel']),
      pkg('Premium', 99999, ['Advanced App', '30 Screens', 'Offline Mode', 'Payment Integration', 'Chat Feature']),
      pkg('Enterprise', 199999, ['Enterprise App', 'Unlimited Screens', 'Custom Backend', 'AI Features', 'White-label']),
    ],
    addons: [addon('UI/UX Design', 14999), addon('Backend API', 19999), addon('App Store Optimization', 4999)],
    maintenancePlan: BigInt(7999),
    isVisible: true,
    sortOrder: BigInt(5),
  },
  {
    name: 'React Native App',
    category: 'App Dev',
    description: 'Cross-platform React Native app that runs on both iOS and Android from a single codebase.',
    packages: [
      pkg('Student', 14999, ['Basic Features', '8 Screens', 'REST API']),
      pkg('Business', 39999, ['Standard Features', '20 Screens', 'State Management', 'Notifications']),
      pkg('Premium', 79999, ['Advanced Features', '40 Screens', 'Real-time Updates', 'Offline Support']),
      pkg('Enterprise', 149999, ['Full Suite', 'Unlimited Screens', 'Custom Modules', 'Enterprise Security']),
    ],
    addons: [addon('Custom Animations', 7999), addon('Biometric Auth', 4999)],
    maintenancePlan: BigInt(5999),
    isVisible: true,
    sortOrder: BigInt(6),
  },
  {
    name: 'Progressive Web App',
    category: 'App Dev',
    description: 'PWA that works offline, installs on devices, and delivers app-like experience.',
    packages: [
      pkg('Student', 8999, ['Basic PWA', 'Offline Mode', 'Push Notifications']),
      pkg('Business', 22999, ['Advanced PWA', 'Background Sync', 'App Shell', 'Analytics']),
      pkg('Premium', 44999, ['Full PWA Suite', 'Advanced Caching', 'Payment Integration', 'Custom Service Worker']),
      pkg('Enterprise', 89999, ['Enterprise PWA', 'Multi-tenant', 'Advanced Security', 'CDN Integration']),
    ],
    addons: [addon('App Icon Design', 2999), addon('Performance Audit', 3999)],
    maintenancePlan: BigInt(3999),
    isVisible: true,
    sortOrder: BigInt(7),
  },
  {
    name: 'Web Application',
    category: 'App Dev',
    description: 'Custom web application with complex business logic, user management, and data processing.',
    packages: [
      pkg('Student', 24999, ['Basic CRUD', 'User Auth', 'Dashboard', 'Basic Reports']),
      pkg('Business', 64999, ['Advanced Features', 'Role Management', 'API Integration', 'Advanced Reports']),
      pkg('Premium', 124999, ['Complex Logic', 'Multi-tenant', 'Real-time Features', 'Custom Analytics']),
      pkg('Enterprise', 249999, ['Enterprise Grade', 'Microservices', 'AI Integration', 'Custom Infrastructure']),
    ],
    addons: [addon('Database Design', 9999), addon('API Documentation', 4999), addon('Security Audit', 7999)],
    maintenancePlan: BigInt(9999),
    isVisible: true,
    sortOrder: BigInt(8),
  },
  // AI Automation (4)
  {
    name: 'AI Chatbot',
    category: 'AI Automation',
    description: 'Intelligent AI chatbot for customer support, lead generation, and sales automation.',
    packages: [
      pkg('Student', 7999, ['Basic FAQ Bot', '100 Conversations/mo', 'WhatsApp Integration']),
      pkg('Business', 19999, ['Smart Chatbot', '1000 Conversations/mo', 'Multi-platform', 'CRM Integration']),
      pkg('Premium', 39999, ['AI-powered Bot', 'Unlimited Conversations', 'Custom Training', 'Analytics Dashboard']),
      pkg('Enterprise', 79999, ['Enterprise AI Bot', 'Custom LLM', 'Multi-language', 'Advanced Analytics']),
    ],
    addons: [addon('Custom Training Data', 9999), addon('Voice Integration', 7999)],
    maintenancePlan: BigInt(3999),
    isVisible: true,
    sortOrder: BigInt(9),
  },
  {
    name: 'Marketing Automation',
    category: 'AI Automation',
    description: 'Automated marketing workflows for email, SMS, WhatsApp, and social media campaigns.',
    packages: [
      pkg('Student', 5999, ['3 Workflows', 'Email Automation', '1000 Contacts']),
      pkg('Business', 14999, ['10 Workflows', 'Multi-channel', '10000 Contacts', 'A/B Testing']),
      pkg('Premium', 29999, ['Unlimited Workflows', 'AI Personalization', 'Unlimited Contacts', 'Advanced Analytics']),
      pkg('Enterprise', 59999, ['Custom Automation', 'AI Optimization', 'Enterprise Scale', 'Dedicated Support']),
    ],
    addons: [addon('WhatsApp Business API', 4999), addon('SMS Gateway Setup', 2999)],
    maintenancePlan: BigInt(2999),
    isVisible: true,
    sortOrder: BigInt(10),
  },
  {
    name: 'AI Content Generation',
    category: 'AI Automation',
    description: 'Automated AI content creation for blogs, social media, ads, and marketing materials.',
    packages: [
      pkg('Student', 3999, ['10 Articles/mo', 'Social Captions', 'Basic Templates']),
      pkg('Business', 9999, ['30 Articles/mo', 'Multi-format Content', 'Brand Voice Training', 'SEO Optimization']),
      pkg('Premium', 19999, ['Unlimited Content', 'Custom AI Model', 'Multi-language', 'Content Calendar']),
      pkg('Enterprise', 39999, ['Enterprise Suite', 'White-label', 'API Access', 'Custom Integrations']),
    ],
    addons: [addon('Image Generation', 4999), addon('Video Script Writing', 3999)],
    maintenancePlan: BigInt(1999),
    isVisible: true,
    sortOrder: BigInt(11),
  },
  {
    name: 'Business Process Automation',
    category: 'AI Automation',
    description: 'Automate repetitive business processes with AI-powered workflows and integrations.',
    packages: [
      pkg('Student', 9999, ['5 Automations', 'Basic Integrations', 'Email Notifications']),
      pkg('Business', 24999, ['20 Automations', 'Advanced Integrations', 'Custom Triggers', 'Reporting']),
      pkg('Premium', 49999, ['Unlimited Automations', 'AI Decision Making', 'Complex Workflows', 'Analytics']),
      pkg('Enterprise', 99999, ['Enterprise Automation', 'Custom AI Models', 'ERP Integration', 'Dedicated Support']),
    ],
    addons: [addon('Zapier Integration', 3999), addon('Custom API Development', 9999)],
    maintenancePlan: BigInt(4999),
    isVisible: true,
    sortOrder: BigInt(12),
  },
  // Digital Marketing (4)
  {
    name: 'SEO Services',
    category: 'Digital Marketing',
    description: 'Comprehensive SEO strategy to improve search rankings and drive organic traffic.',
    packages: [
      pkg('Student', 4999, ['10 Keywords', 'On-page SEO', 'Monthly Report']),
      pkg('Business', 12999, ['30 Keywords', 'Technical SEO', 'Link Building', 'Content Strategy']),
      pkg('Premium', 24999, ['60 Keywords', 'Advanced SEO', 'Competitor Analysis', 'Content Creation']),
      pkg('Enterprise', 49999, ['Unlimited Keywords', 'Enterprise SEO', 'International SEO', 'Dedicated Team']),
    ],
    addons: [addon('Local SEO Setup', 2999), addon('Google My Business', 1999)],
    maintenancePlan: BigInt(4999),
    isVisible: true,
    sortOrder: BigInt(13),
  },
  {
    name: 'Social Media Marketing',
    category: 'Digital Marketing',
    description: 'Strategic social media management and content creation across all major platforms.',
    packages: [
      pkg('Student', 5999, ['2 Platforms', '12 Posts/mo', 'Basic Analytics']),
      pkg('Business', 14999, ['4 Platforms', '30 Posts/mo', 'Story Creation', 'Community Management']),
      pkg('Premium', 29999, ['6 Platforms', '60 Posts/mo', 'Influencer Outreach', 'Paid Ads Management']),
      pkg('Enterprise', 59999, ['All Platforms', 'Unlimited Posts', 'Full Strategy', 'Dedicated Manager']),
    ],
    addons: [addon('Reel/Short Video Creation', 7999), addon('Influencer Campaign', 14999)],
    maintenancePlan: BigInt(5999),
    isVisible: true,
    sortOrder: BigInt(14),
  },
  {
    name: 'Google Ads Management',
    category: 'Digital Marketing',
    description: 'Expert Google Ads campaign management for maximum ROI and lead generation.',
    packages: [
      pkg('Student', 4999, ['1 Campaign', '₹10k Ad Budget', 'Basic Optimization']),
      pkg('Business', 11999, ['3 Campaigns', '₹30k Ad Budget', 'A/B Testing', 'Conversion Tracking']),
      pkg('Premium', 22999, ['10 Campaigns', '₹1L Ad Budget', 'Advanced Bidding', 'Shopping Ads']),
      pkg('Enterprise', 44999, ['Unlimited Campaigns', 'Custom Budget', 'AI Bidding', 'Full Attribution']),
    ],
    addons: [addon('Landing Page Creation', 7999), addon('Remarketing Setup', 3999)],
    maintenancePlan: BigInt(4999),
    isVisible: true,
    sortOrder: BigInt(15),
  },
  {
    name: 'Email Marketing',
    category: 'Digital Marketing',
    description: 'Professional email marketing campaigns with automation, segmentation, and analytics.',
    packages: [
      pkg('Student', 2999, ['1000 Subscribers', '4 Campaigns/mo', 'Basic Templates']),
      pkg('Business', 7999, ['10000 Subscribers', '12 Campaigns/mo', 'Automation', 'A/B Testing']),
      pkg('Premium', 14999, ['50000 Subscribers', 'Unlimited Campaigns', 'Advanced Automation', 'Custom Templates']),
      pkg('Enterprise', 29999, ['Unlimited Subscribers', 'Enterprise Features', 'Dedicated IP', 'Custom Integration']),
    ],
    addons: [addon('Email Template Design', 3999), addon('List Cleaning', 1999)],
    maintenancePlan: BigInt(2499),
    isVisible: true,
    sortOrder: BigInt(16),
  },
  // Branding (3)
  {
    name: 'Brand Identity Design',
    category: 'Branding',
    description: 'Complete brand identity including logo, color palette, typography, and brand guidelines.',
    packages: [
      pkg('Student', 4999, ['Logo Design', 'Color Palette', 'Basic Brand Guide']),
      pkg('Business', 12999, ['Logo + Variations', 'Full Brand Guide', 'Business Card', 'Letterhead']),
      pkg('Premium', 24999, ['Complete Identity', 'Brand Strategy', 'All Collaterals', 'Social Media Kit']),
      pkg('Enterprise', 49999, ['Enterprise Branding', 'Brand Architecture', 'Full Collateral Suite', 'Brand Training']),
    ],
    addons: [addon('Brand Video', 9999), addon('Packaging Design', 7999)],
    maintenancePlan: BigInt(0),
    isVisible: true,
    sortOrder: BigInt(17),
  },
  {
    name: 'Logo Design',
    category: 'Branding',
    description: 'Professional logo design with multiple concepts, revisions, and all file formats.',
    packages: [
      pkg('Student', 1999, ['2 Concepts', '2 Revisions', 'PNG/JPG Files']),
      pkg('Business', 4999, ['5 Concepts', '5 Revisions', 'All File Formats', 'Brand Colors']),
      pkg('Premium', 9999, ['10 Concepts', 'Unlimited Revisions', 'All Formats', 'Brand Guidelines']),
      pkg('Enterprise', 19999, ['Custom Process', 'Brand Strategy', 'Trademark Ready', 'Full Brand Kit']),
    ],
    addons: [addon('Animated Logo', 3999), addon('3D Logo Version', 4999)],
    maintenancePlan: BigInt(0),
    isVisible: true,
    sortOrder: BigInt(18),
  },
  {
    name: 'Marketing Collaterals',
    category: 'Branding',
    description: 'Professional marketing materials including brochures, flyers, banners, and presentations.',
    packages: [
      pkg('Student', 2999, ['5 Designs', 'Print Ready', 'Basic Templates']),
      pkg('Business', 7999, ['15 Designs', 'Custom Design', 'Digital + Print', 'Brand Consistent']),
      pkg('Premium', 14999, ['30 Designs', 'Premium Design', 'Animation', 'Full Suite']),
      pkg('Enterprise', 29999, ['Unlimited Designs', 'Dedicated Designer', 'Rush Delivery', 'Brand Management']),
    ],
    addons: [addon('Trade Show Materials', 9999), addon('Vehicle Branding', 14999)],
    maintenancePlan: BigInt(0),
    isVisible: true,
    sortOrder: BigInt(19),
  },
  // SaaS (4)
  {
    name: 'SaaS Product Development',
    category: 'SaaS',
    description: 'End-to-end SaaS product development with subscription management, billing, and multi-tenancy.',
    packages: [
      pkg('Student', 49999, ['MVP Development', 'Basic Auth', 'Stripe Integration', 'Admin Panel']),
      pkg('Business', 124999, ['Full Product', 'Multi-tenant', 'Advanced Billing', 'Analytics', 'API']),
      pkg('Premium', 249999, ['Enterprise SaaS', 'Custom Features', 'White-label', 'Advanced Security']),
      pkg('Enterprise', 499999, ['Full Platform', 'Custom Infrastructure', 'Dedicated Team', 'SLA']),
    ],
    addons: [addon('Mobile App', 49999), addon('AI Features', 29999), addon('Custom Integrations', 19999)],
    maintenancePlan: BigInt(14999),
    isVisible: true,
    sortOrder: BigInt(20),
  },
  {
    name: 'CRM Development',
    category: 'SaaS',
    description: 'Custom CRM system tailored to your business processes with automation and analytics.',
    packages: [
      pkg('Student', 24999, ['Basic CRM', 'Contact Management', 'Pipeline View', 'Email Integration']),
      pkg('Business', 59999, ['Advanced CRM', 'Automation', 'Custom Fields', 'Reports', 'API']),
      pkg('Premium', 119999, ['Enterprise CRM', 'AI Insights', 'Advanced Automation', 'Custom Modules']),
      pkg('Enterprise', 239999, ['Custom Platform', 'ERP Integration', 'AI Forecasting', 'Dedicated Support']),
    ],
    addons: [addon('Mobile CRM App', 19999), addon('WhatsApp Integration', 7999)],
    maintenancePlan: BigInt(7999),
    isVisible: true,
    sortOrder: BigInt(21),
  },
  {
    name: 'Booking & Scheduling System',
    category: 'SaaS',
    description: 'Online booking and appointment scheduling system with payment integration.',
    packages: [
      pkg('Student', 9999, ['Basic Booking', 'Calendar Integration', 'Email Reminders']),
      pkg('Business', 24999, ['Advanced Booking', 'Multiple Staff', 'Payment Integration', 'SMS Reminders']),
      pkg('Premium', 49999, ['Full Platform', 'Multi-location', 'Custom Branding', 'Analytics']),
      pkg('Enterprise', 99999, ['Enterprise System', 'API Integration', 'Custom Features', 'White-label']),
    ],
    addons: [addon('Mobile App', 19999), addon('Zoom Integration', 3999)],
    maintenancePlan: BigInt(3999),
    isVisible: true,
    sortOrder: BigInt(22),
  },
  {
    name: 'HR & Payroll System',
    category: 'SaaS',
    description: 'Complete HR management system with payroll, attendance, and employee self-service.',
    packages: [
      pkg('Student', 14999, ['Up to 25 Employees', 'Basic HR', 'Attendance Tracking']),
      pkg('Business', 34999, ['Up to 100 Employees', 'Full HR Suite', 'Payroll', 'Leave Management']),
      pkg('Premium', 69999, ['Up to 500 Employees', 'Advanced Analytics', 'Compliance', 'API Integration']),
      pkg('Enterprise', 139999, ['Unlimited Employees', 'Custom Modules', 'ERP Integration', 'Dedicated Support']),
    ],
    addons: [addon('Biometric Integration', 9999), addon('Mobile App', 14999)],
    maintenancePlan: BigInt(5999),
    isVisible: true,
    sortOrder: BigInt(23),
  },
  // Business Setup (3)
  {
    name: 'Company Registration',
    category: 'Business Setup',
    description: 'Complete company registration and compliance setup for startups and businesses.',
    packages: [
      pkg('Student', 4999, ['Sole Proprietorship', 'Basic Registration', 'PAN/TAN']),
      pkg('Business', 9999, ['Private Limited', 'Full Registration', 'GST Registration', 'Bank Account']),
      pkg('Premium', 19999, ['LLP/OPC', 'Complete Setup', 'Compliance Calendar', 'CA Support']),
      pkg('Enterprise', 39999, ['Public Limited', 'Full Compliance', 'Legal Support', 'Dedicated CA']),
    ],
    addons: [addon('GST Filing (Annual)', 4999), addon('Trademark Registration', 7999)],
    maintenancePlan: BigInt(2999),
    isVisible: true,
    sortOrder: BigInt(24),
  },
  {
    name: 'Business Plan & Strategy',
    category: 'Business Setup',
    description: 'Professional business plan, financial projections, and go-to-market strategy.',
    packages: [
      pkg('Student', 7999, ['Basic Business Plan', 'Market Analysis', 'Financial Projections']),
      pkg('Business', 19999, ['Comprehensive Plan', 'Competitor Analysis', 'Investor Deck', 'Strategy']),
      pkg('Premium', 39999, ['Full Strategy', 'Market Research', 'Financial Modeling', 'Pitch Deck']),
      pkg('Enterprise', 79999, ['Enterprise Strategy', 'Board Presentation', 'Fundraising Support', 'Mentorship']),
    ],
    addons: [addon('Pitch Deck Design', 9999), addon('Financial Model', 7999)],
    maintenancePlan: BigInt(0),
    isVisible: true,
    sortOrder: BigInt(25),
  },
  {
    name: 'Digital Presence Setup',
    category: 'Business Setup',
    description: 'Complete digital presence setup including website, social media, and Google Business.',
    packages: [
      pkg('Student', 5999, ['Basic Website', 'Google My Business', '2 Social Profiles']),
      pkg('Business', 14999, ['Professional Website', 'Full GMB Setup', '5 Social Profiles', 'Email Setup']),
      pkg('Premium', 29999, ['Premium Website', 'Full Digital Setup', 'All Platforms', 'Content Strategy']),
      pkg('Enterprise', 59999, ['Enterprise Presence', 'Custom Strategy', 'Dedicated Manager', 'Monthly Reports']),
    ],
    addons: [addon('Professional Photography', 7999), addon('Video Production', 14999)],
    maintenancePlan: BigInt(3999),
    isVisible: true,
    sortOrder: BigInt(26),
  },
];
