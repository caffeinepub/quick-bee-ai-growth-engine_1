export interface MasterPlan {
  name: string;
  tagline: string;
  priceINR: number;
  color: string;
  features: string[];
  popular?: boolean;
}

export const masterPlans: MasterPlan[] = [
  {
    name: 'Spark',
    tagline: 'Perfect for startups & small businesses',
    priceINR: 49999,
    color: '#00b4a6',
    features: [
      'Professional Website (5 pages)',
      'Basic SEO Setup',
      'Social Media Setup (2 platforms)',
      'Logo & Brand Identity',
      'WhatsApp Business Integration',
      '3 Months Support',
      'Monthly Analytics Report',
      'Google My Business Setup',
    ],
  },
  {
    name: 'Surge',
    tagline: 'For growing businesses ready to scale',
    priceINR: 99999,
    color: '#00d4c8',
    popular: true,
    features: [
      'Everything in Spark',
      'E-commerce Website (up to 50 products)',
      'Advanced SEO & Content Strategy',
      'Social Media Management (4 platforms)',
      'AI Chatbot Integration',
      'CRM Setup & Integration',
      'Email Marketing Automation',
      'Razorpay Payment Gateway',
      '6 Months Priority Support',
      'Bi-weekly Analytics Reports',
      'Google Ads Campaign Setup',
    ],
  },
  {
    name: 'Titan',
    tagline: 'Enterprise-grade digital transformation',
    priceINR: 199999,
    color: '#00b4a6',
    features: [
      'Everything in Surge',
      'Custom Web Application',
      'Mobile App (iOS + Android)',
      'AI Automation Suite',
      'SaaS Product Development',
      'Dedicated Account Manager',
      'Custom AI Model Integration',
      'Multi-platform Marketing',
      'Advanced Analytics Dashboard',
      '12 Months Premium Support',
      'Quarterly Business Reviews',
      'White-label Solutions',
    ],
  },
];
