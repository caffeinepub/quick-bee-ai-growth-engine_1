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
    id: "svc-001",
    title: "Social Media Management – Starter",
    description:
      "Basic social media management for small businesses. Includes content planning, posting, and monthly reporting.",
    category: "Social Media",
    packages: [
      {
        name: "Starter",
        price: 3999,
        features: ["3 platforms", "12 posts/month", "Monthly report"],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-002",
    title: "Social Media Management – Growth",
    description:
      "Comprehensive social media management with engagement, stories, and bi-weekly reporting.",
    category: "Social Media",
    packages: [
      {
        name: "Growth",
        price: 7499,
        features: [
          "4 platforms",
          "20 posts/month",
          "Stories",
          "Bi-weekly report",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-003",
    title: "Social Media Management – Pro",
    description:
      "Full-service social media management with reels, influencer coordination, and weekly reporting.",
    category: "Social Media",
    packages: [
      {
        name: "Pro",
        price: 12499,
        features: [
          "5 platforms",
          "30 posts/month",
          "Reels",
          "Influencer coordination",
          "Weekly report",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── SEO ──────────────────────────────────────────────────────────────────
  {
    id: "svc-004",
    title: "SEO – Basic",
    description:
      "On-page SEO optimization, keyword research, and monthly ranking report for up to 10 keywords.",
    category: "SEO",
    packages: [
      {
        name: "Basic",
        price: 2999,
        features: ["10 keywords", "On-page SEO", "Monthly report"],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-005",
    title: "SEO – Standard",
    description:
      "Comprehensive SEO with on-page, off-page, technical audit, and link building for up to 25 keywords.",
    category: "SEO",
    packages: [
      {
        name: "Standard",
        price: 5999,
        features: [
          "25 keywords",
          "On-page + Off-page",
          "Technical audit",
          "Link building",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-006",
    title: "SEO – Enterprise",
    description:
      "Enterprise-grade SEO with unlimited keywords, dedicated account manager, and weekly reporting.",
    category: "SEO",
    packages: [
      {
        name: "Enterprise",
        price: 12499,
        features: [
          "Unlimited keywords",
          "Dedicated manager",
          "Weekly report",
          "Competitor analysis",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── PAID ADS ─────────────────────────────────────────────────────────────
  {
    id: "svc-007",
    title: "Google Ads Management",
    description:
      "Setup and management of Google Search, Display, and Shopping campaigns with monthly optimization.",
    category: "Paid Ads",
    packages: [
      {
        name: "Starter",
        price: 3999,
        features: [
          "Campaign setup",
          "Monthly optimization",
          "Performance report",
        ],
      },
      {
        name: "Growth",
        price: 7499,
        features: [
          "Multiple campaigns",
          "Bi-weekly optimization",
          "A/B testing",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-008",
    title: "Meta Ads Management",
    description:
      "Facebook and Instagram paid advertising with audience targeting, creative strategy, and reporting.",
    category: "Paid Ads",
    packages: [
      {
        name: "Starter",
        price: 3499,
        features: ["FB + IG ads", "Audience targeting", "Monthly report"],
      },
      {
        name: "Growth",
        price: 6999,
        features: ["Retargeting", "Lookalike audiences", "Creative strategy"],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-009",
    title: "LinkedIn Ads Management",
    description:
      "B2B LinkedIn advertising for lead generation, brand awareness, and event promotion.",
    category: "Paid Ads",
    packages: [
      {
        name: "Standard",
        price: 5999,
        features: ["Lead gen forms", "Sponsored content", "Monthly report"],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── CONTENT MARKETING ────────────────────────────────────────────────────
  {
    id: "svc-010",
    title: "Blog Writing – Starter",
    description:
      "SEO-optimized blog articles written by expert content writers. 4 articles per month.",
    category: "Content Marketing",
    packages: [
      {
        name: "Starter",
        price: 2499,
        features: ["4 articles/month", "SEO optimized", "800–1000 words each"],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-011",
    title: "Blog Writing – Growth",
    description:
      "High-quality long-form blog content with keyword research and internal linking. 8 articles per month.",
    category: "Content Marketing",
    packages: [
      {
        name: "Growth",
        price: 4499,
        features: [
          "8 articles/month",
          "Long-form content",
          "Keyword research",
          "Internal linking",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-012",
    title: "Video Script Writing",
    description:
      "Professional video scripts for YouTube, reels, ads, and explainer videos.",
    category: "Content Marketing",
    packages: [
      {
        name: "Basic",
        price: 1499,
        features: ["2 scripts/month", "Up to 5 min each"],
      },
      {
        name: "Pro",
        price: 3499,
        features: ["5 scripts/month", "Up to 10 min each", "Storyboard notes"],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── EMAIL MARKETING ───────────────────────────────────────────────────────
  {
    id: "svc-013",
    title: "Email Marketing – Starter",
    description:
      "Monthly email newsletter design, copywriting, and campaign management for up to 2,000 subscribers.",
    category: "Email Marketing",
    packages: [
      {
        name: "Starter",
        price: 1999,
        features: [
          "2 campaigns/month",
          "Up to 2,000 subscribers",
          "Template design",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-014",
    title: "Email Marketing – Growth",
    description:
      "Advanced email marketing with automation sequences, segmentation, and A/B testing.",
    category: "Email Marketing",
    packages: [
      {
        name: "Growth",
        price: 4499,
        features: [
          "4 campaigns/month",
          "Automation sequences",
          "Segmentation",
          "A/B testing",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-015",
    title: "Email Marketing – Enterprise",
    description:
      "Full-service email marketing with drip campaigns, CRM integration, and dedicated account manager.",
    category: "Email Marketing",
    packages: [
      {
        name: "Enterprise",
        price: 8999,
        features: [
          "Unlimited campaigns",
          "Drip sequences",
          "CRM integration",
          "Dedicated manager",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── WEBSITE DEVELOPMENT ───────────────────────────────────────────────────
  {
    id: "svc-016",
    title: "Landing Page Design",
    description:
      "High-converting landing page design and development with mobile responsiveness and CTA optimization.",
    category: "Web Development",
    packages: [
      {
        name: "Basic",
        price: 5999,
        features: [
          "1 landing page",
          "Mobile responsive",
          "CTA optimization",
          "2 revisions",
        ],
      },
      {
        name: "Pro",
        price: 9999,
        features: [
          "1 landing page",
          "A/B test variant",
          "Analytics integration",
          "5 revisions",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-017",
    title: "Business Website Development",
    description:
      "Professional 5–10 page business website with CMS, contact forms, and SEO setup.",
    category: "Web Development",
    packages: [
      {
        name: "Standard",
        price: 17499,
        features: [
          "5–10 pages",
          "CMS integration",
          "Contact forms",
          "Basic SEO",
        ],
      },
      {
        name: "Premium",
        price: 29999,
        features: [
          "Up to 20 pages",
          "E-commerce ready",
          "Advanced SEO",
          "Speed optimization",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-018",
    title: "E-Commerce Website",
    description:
      "Full-featured e-commerce website with product catalog, payment gateway, and order management.",
    category: "Web Development",
    packages: [
      {
        name: "Starter",
        price: 24999,
        features: [
          "Up to 50 products",
          "Payment gateway",
          "Order management",
          "Mobile responsive",
        ],
      },
      {
        name: "Growth",
        price: 44999,
        features: [
          "Unlimited products",
          "Multi-payment",
          "Inventory management",
          "Analytics",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── GRAPHIC DESIGN ────────────────────────────────────────────────────────
  {
    id: "svc-019",
    title: "Brand Identity Design",
    description:
      "Complete brand identity including logo, color palette, typography, and brand guidelines.",
    category: "Graphic Design",
    packages: [
      {
        name: "Basic",
        price: 3999,
        features: ["Logo design", "Color palette", "Typography", "3 concepts"],
      },
      {
        name: "Premium",
        price: 8999,
        features: [
          "Full brand kit",
          "Business card",
          "Letterhead",
          "Brand guidelines doc",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-020",
    title: "Social Media Graphics Pack",
    description:
      "Custom social media graphic templates for posts, stories, and covers across all platforms.",
    category: "Graphic Design",
    packages: [
      {
        name: "Starter",
        price: 1999,
        features: ["10 post templates", "5 story templates", "Editable files"],
      },
      {
        name: "Pro",
        price: 3999,
        features: [
          "20 post templates",
          "10 story templates",
          "Cover designs",
          "Editable files",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-021",
    title: "Brochure & Flyer Design",
    description:
      "Professional print and digital brochure and flyer design for marketing campaigns.",
    category: "Graphic Design",
    packages: [
      {
        name: "Single",
        price: 1299,
        features: ["1 design", "2 revisions", "Print-ready file"],
      },
      {
        name: "Pack",
        price: 2999,
        features: ["3 designs", "3 revisions each", "Print + digital files"],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── VIDEO PRODUCTION ──────────────────────────────────────────────────────
  {
    id: "svc-022",
    title: "Reels & Short Video Editing",
    description:
      "Professional editing of Instagram Reels, YouTube Shorts, and TikTok videos with captions and music.",
    category: "Video Production",
    packages: [
      {
        name: "Basic",
        price: 1499,
        features: ["4 videos/month", "Captions", "Music sync"],
      },
      {
        name: "Pro",
        price: 3499,
        features: [
          "10 videos/month",
          "Motion graphics",
          "Captions",
          "Thumbnail design",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-023",
    title: "Corporate Video Production",
    description:
      "End-to-end corporate video production including scripting, shooting, and post-production.",
    category: "Video Production",
    packages: [
      {
        name: "Standard",
        price: 12499,
        features: ["Up to 3 min video", "Script", "Shoot", "Post-production"],
      },
      {
        name: "Premium",
        price: 24999,
        features: [
          "Up to 5 min video",
          "Multiple locations",
          "Professional crew",
          "Color grading",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-024",
    title: "Explainer Video (Animated)",
    description:
      "Animated explainer videos for products, services, and onboarding with voiceover.",
    category: "Video Production",
    packages: [
      {
        name: "Basic",
        price: 7499,
        features: ["Up to 60 sec", "Script", "Animation", "Voiceover"],
      },
      {
        name: "Pro",
        price: 14999,
        features: [
          "Up to 2 min",
          "Custom characters",
          "Professional voiceover",
          "Music",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── AUTOMATION & AI ───────────────────────────────────────────────────────
  {
    id: "svc-025",
    title: "WhatsApp Business Automation",
    description:
      "Set up WhatsApp Business API with automated replies, chatbot flows, and lead capture.",
    category: "Automation & AI",
    packages: [
      {
        name: "Basic",
        price: 4999,
        features: ["Chatbot setup", "Auto-reply flows", "Lead capture"],
      },
      {
        name: "Advanced",
        price: 9999,
        features: [
          "CRM integration",
          "Multi-agent support",
          "Analytics dashboard",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-026",
    title: "CRM Setup & Automation",
    description:
      "Setup and configure CRM with automated lead nurturing, pipeline management, and reporting.",
    category: "Automation & AI",
    packages: [
      {
        name: "Starter",
        price: 5999,
        features: ["CRM setup", "Lead pipeline", "Basic automation"],
      },
      {
        name: "Pro",
        price: 12499,
        features: [
          "Advanced automation",
          "Email sequences",
          "Reporting dashboard",
          "Training",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-027",
    title: "AI Chatbot Development",
    description:
      "Custom AI-powered chatbot for website, WhatsApp, or social media with NLP capabilities.",
    category: "Automation & AI",
    packages: [
      {
        name: "Basic",
        price: 8999,
        features: ["FAQ chatbot", "Lead capture", "Website integration"],
      },
      {
        name: "Advanced",
        price: 40000,
        features: [
          "NLP-powered",
          "Multi-platform",
          "CRM integration",
          "Analytics",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── LEAD GENERATION ───────────────────────────────────────────────────────
  {
    id: "svc-028",
    title: "Lead Generation – Starter",
    description:
      "Targeted lead generation using LinkedIn, email outreach, and landing pages.",
    category: "Lead Generation",
    packages: [
      {
        name: "Starter",
        price: 4999,
        features: ["50 leads/month", "LinkedIn outreach", "Email campaigns"],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-029",
    title: "Lead Generation – Growth",
    description:
      "Multi-channel lead generation with paid ads, SEO, and content marketing integration.",
    category: "Lead Generation",
    packages: [
      {
        name: "Growth",
        price: 9999,
        features: [
          "150 leads/month",
          "Multi-channel",
          "Paid ads",
          "Lead scoring",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-030",
    title: "B2B Lead Generation",
    description:
      "Specialized B2B lead generation with account-based marketing and decision-maker targeting.",
    category: "Lead Generation",
    packages: [
      {
        name: "Standard",
        price: 14999,
        features: [
          "100 qualified leads",
          "ABM strategy",
          "Decision-maker targeting",
          "CRM integration",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── REPUTATION MANAGEMENT ─────────────────────────────────────────────────
  {
    id: "svc-031",
    title: "Online Reputation Management",
    description:
      "Monitor, manage, and improve your online reputation across Google, social media, and review platforms.",
    category: "Reputation Management",
    packages: [
      {
        name: "Basic",
        price: 3999,
        features: [
          "Review monitoring",
          "Response management",
          "Monthly report",
        ],
      },
      {
        name: "Pro",
        price: 8999,
        features: [
          "Multi-platform",
          "Crisis management",
          "Sentiment analysis",
          "Weekly report",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-032",
    title: "Google My Business Optimization",
    description:
      "Complete GMB profile optimization, post management, and review response service.",
    category: "Reputation Management",
    packages: [
      {
        name: "Standard",
        price: 2499,
        features: [
          "Profile optimization",
          "8 posts/month",
          "Review responses",
          "Q&A management",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  // ── ANALYTICS & REPORTING ─────────────────────────────────────────────────
  {
    id: "svc-033",
    title: "Marketing Analytics Setup",
    description:
      "Setup Google Analytics 4, Tag Manager, and custom dashboards for comprehensive marketing tracking.",
    category: "Analytics",
    packages: [
      {
        name: "Basic",
        price: 3999,
        features: ["GA4 setup", "Tag Manager", "Basic dashboard"],
      },
      {
        name: "Advanced",
        price: 8999,
        features: [
          "Custom dashboards",
          "Conversion tracking",
          "Attribution modeling",
          "Training",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-034",
    title: "Monthly Marketing Report",
    description:
      "Comprehensive monthly marketing performance report with insights and recommendations.",
    category: "Analytics",
    packages: [
      {
        name: "Standard",
        price: 2499,
        features: [
          "All channels",
          "KPI tracking",
          "Insights & recommendations",
          "Executive summary",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-035",
    title: "Competitor Analysis Report",
    description:
      "In-depth competitor analysis covering SEO, social media, ads, and content strategy.",
    category: "Analytics",
    packages: [
      {
        name: "Standard",
        price: 3499,
        features: [
          "5 competitors",
          "SEO analysis",
          "Social media audit",
          "Ad strategy review",
        ],
      },
      {
        name: "Premium",
        price: 7499,
        features: [
          "10 competitors",
          "Full digital audit",
          "SWOT analysis",
          "Action plan",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── DIGITAL MARKETING ─────────────────────────────────────────────────────
  {
    id: "svc-036",
    title: "Digital Marketing Strategy Consultation",
    description:
      "One-on-one strategy session to build a customized digital marketing roadmap for your business.",
    category: "Digital Marketing",
    packages: [
      {
        name: "Single Session",
        price: 2499,
        features: [
          "2-hour consultation",
          "Custom roadmap",
          "Action plan document",
        ],
      },
      {
        name: "Monthly Retainer",
        price: 7499,
        features: ["4 sessions/month", "Ongoing strategy", "Priority support"],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-037",
    title: "Performance Marketing",
    description:
      "Data-driven performance marketing campaigns focused on measurable ROI across all digital channels.",
    category: "Digital Marketing",
    packages: [
      {
        name: "Starter",
        price: 5999,
        features: ["Campaign setup", "ROI tracking", "Monthly optimization"],
      },
      {
        name: "Growth",
        price: 12499,
        features: [
          "Multi-channel campaigns",
          "Advanced ROI tracking",
          "Bi-weekly optimization",
          "A/B testing",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-038",
    title: "Influencer Marketing",
    description:
      "End-to-end influencer marketing campaigns including identification, outreach, and performance tracking.",
    category: "Digital Marketing",
    packages: [
      {
        name: "Micro",
        price: 7499,
        features: [
          "5 micro-influencers",
          "Campaign brief",
          "Performance report",
        ],
      },
      {
        name: "Macro",
        price: 17499,
        features: [
          "2 macro-influencers",
          "Content strategy",
          "Detailed analytics",
          "Contract management",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── BUSINESS & AGENCY PACKS ───────────────────────────────────────────────
  {
    id: "svc-039",
    title: "Startup Launch Pack",
    description:
      "Complete digital marketing launch package for startups — brand identity, social setup, and initial campaigns.",
    category: "Business & Agency",
    packages: [
      {
        name: "Launch",
        price: 12499,
        features: [
          "Brand identity",
          "Social media setup",
          "1-month management",
          "Google My Business",
          "Basic SEO",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-040",
    title: "Small Business Growth Pack",
    description:
      "Bundled digital marketing services tailored for small businesses looking to grow their online presence.",
    category: "Business & Agency",
    packages: [
      {
        name: "Starter",
        price: 8999,
        features: [
          "Social media management",
          "SEO basics",
          "Monthly report",
          "2 platforms",
        ],
      },
      {
        name: "Growth",
        price: 15999,
        features: [
          "Social media + SEO",
          "Google Ads",
          "Email marketing",
          "Monthly strategy call",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-041",
    title: "Restaurant & Food Business Pack",
    description:
      "Specialized digital marketing for restaurants, cafes, and food businesses with local SEO and social media.",
    category: "Business & Agency",
    packages: [
      {
        name: "Basic",
        price: 5999,
        features: [
          "Instagram + Facebook management",
          "GMB optimization",
          "Food photography tips",
          "Monthly report",
        ],
      },
      {
        name: "Pro",
        price: 10999,
        features: [
          "Full social management",
          "Zomato/Swiggy optimization",
          "Paid ads",
          "Influencer tie-up",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-042",
    title: "Real Estate Digital Marketing Pack",
    description:
      "Targeted digital marketing for real estate agents and developers with lead generation and property promotion.",
    category: "Business & Agency",
    packages: [
      {
        name: "Standard",
        price: 9999,
        features: [
          "Property listing ads",
          "Lead generation",
          "Social media",
          "WhatsApp automation",
        ],
      },
      {
        name: "Premium",
        price: 40000,
        features: [
          "Multi-platform ads",
          "Virtual tour promotion",
          "CRM setup",
          "Weekly reporting",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-043",
    title: "Healthcare & Clinic Marketing Pack",
    description:
      "HIPAA-compliant digital marketing for clinics, hospitals, and healthcare professionals.",
    category: "Business & Agency",
    packages: [
      {
        name: "Basic",
        price: 7499,
        features: [
          "GMB optimization",
          "Social media management",
          "Patient review management",
          "Monthly report",
        ],
      },
      {
        name: "Pro",
        price: 13999,
        features: [
          "Full digital presence",
          "Appointment booking ads",
          "Content marketing",
          "Reputation management",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-044",
    title: "Education & Coaching Marketing Pack",
    description:
      "Digital marketing solutions for coaching institutes, ed-tech platforms, and educational institutions.",
    category: "Business & Agency",
    packages: [
      {
        name: "Starter",
        price: 6999,
        features: [
          "Social media management",
          "Lead generation ads",
          "WhatsApp follow-up",
          "Monthly report",
        ],
      },
      {
        name: "Growth",
        price: 13999,
        features: [
          "Multi-platform ads",
          "SEO",
          "Email campaigns",
          "Enrollment funnel setup",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-045",
    title: "E-Commerce Growth Pack",
    description:
      "Comprehensive digital marketing for e-commerce stores to drive traffic, conversions, and repeat purchases.",
    category: "Business & Agency",
    packages: [
      {
        name: "Starter",
        price: 9999,
        features: [
          "Meta + Google Shopping ads",
          "Social media",
          "Email marketing",
          "Monthly report",
        ],
      },
      {
        name: "Scale",
        price: 22499,
        features: [
          "Full funnel ads",
          "Retargeting",
          "Influencer marketing",
          "SEO",
          "Analytics dashboard",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-046",
    title: "Agency White-Label Pack",
    description:
      "White-label digital marketing services for agencies to resell under their own brand.",
    category: "Business & Agency",
    packages: [
      {
        name: "Basic",
        price: 14999,
        features: [
          "Social media management",
          "SEO",
          "White-label reports",
          "Dedicated account manager",
        ],
      },
      {
        name: "Pro",
        price: 29999,
        features: [
          "Full-service white-label",
          "Paid ads",
          "Content creation",
          "Priority support",
          "Custom reporting",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-047",
    title: "Monthly Retainer – Basic",
    description:
      "Flexible monthly retainer for ongoing digital marketing support and execution.",
    category: "Business & Agency",
    packages: [
      {
        name: "Basic Retainer",
        price: 7499,
        features: [
          "10 hours/month",
          "Social media",
          "Basic SEO",
          "Monthly report",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-048",
    title: "Monthly Retainer – Standard",
    description:
      "Standard monthly retainer covering social media, SEO, and paid ads management.",
    category: "Business & Agency",
    packages: [
      {
        name: "Standard Retainer",
        price: 14999,
        features: [
          "20 hours/month",
          "Social media + SEO",
          "Paid ads management",
          "Bi-weekly calls",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-049",
    title: "Monthly Retainer – Pro",
    description:
      "Pro monthly retainer with full-service digital marketing, dedicated manager, and priority support.",
    category: "Business & Agency",
    packages: [
      {
        name: "Pro Retainer",
        price: 24999,
        features: [
          "40 hours/month",
          "Full-service marketing",
          "Dedicated manager",
          "Weekly strategy calls",
          "Priority support",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-050",
    title: "Monthly Retainer – Enterprise",
    description:
      "Enterprise monthly retainer for large businesses requiring comprehensive digital marketing coverage.",
    category: "Business & Agency",
    packages: [
      {
        name: "Enterprise Retainer",
        price: 49999,
        features: [
          "Unlimited hours",
          "Full-service marketing",
          "Dedicated team",
          "Daily reporting",
          "C-suite access",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── STUDENT PACKS ─────────────────────────────────────────────────────────
  {
    id: "svc-051",
    title: "Student Social Media Starter Pack",
    description:
      "Affordable social media management package designed for student entrepreneurs and small personal brands.",
    category: "Student",
    packages: [
      {
        name: "Student Starter",
        price: 1499,
        features: [
          "2 platforms",
          "8 posts/month",
          "Basic graphics",
          "Monthly report",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-052",
    title: "Student SEO Pack",
    description:
      "Entry-level SEO package for student projects, blogs, and small websites.",
    category: "Student",
    packages: [
      {
        name: "Student SEO",
        price: 1299,
        features: [
          "5 keywords",
          "On-page SEO",
          "Basic backlinks",
          "Monthly report",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-053",
    title: "Student Content Creation Pack",
    description:
      "Budget-friendly content creation for student blogs, portfolios, and social media channels.",
    category: "Student",
    packages: [
      {
        name: "Student Content",
        price: 999,
        features: [
          "4 blog posts/month",
          "Social media captions",
          "Basic graphics",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-054",
    title: "Student Brand Building Pack",
    description:
      "Personal brand building package for students and fresh graduates entering the job market.",
    category: "Student",
    packages: [
      {
        name: "Student Brand",
        price: 1999,
        features: [
          "LinkedIn optimization",
          "Personal website setup",
          "Portfolio content",
          "Social media setup",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-055",
    title: "Student Digital Marketing Internship Pack",
    description:
      "Hands-on digital marketing project support for students completing internships or academic projects.",
    category: "Student",
    packages: [
      {
        name: "Internship Support",
        price: 2499,
        features: [
          "Project guidance",
          "Campaign setup",
          "Analytics access",
          "Certificate of completion",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── PREMIUM & SCALE ───────────────────────────────────────────────────────
  {
    id: "svc-056",
    title: "Premium Brand Accelerator",
    description:
      "High-impact brand acceleration program combining SEO, paid ads, content, and influencer marketing.",
    category: "Premium & Scale",
    packages: [
      {
        name: "Accelerator",
        price: 37499,
        features: [
          "Full SEO suite",
          "Multi-platform ads",
          "Influencer campaigns",
          "Content marketing",
          "Weekly reporting",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-057",
    title: "Scale-Up Marketing Suite",
    description:
      "Comprehensive marketing suite for businesses ready to scale with advanced automation and analytics.",
    category: "Premium & Scale",
    packages: [
      {
        name: "Scale-Up",
        price: 44999,
        features: [
          "Marketing automation",
          "Advanced analytics",
          "Multi-channel campaigns",
          "CRM integration",
          "Dedicated team",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-058",
    title: "Premium Content & SEO Bundle",
    description:
      "Premium content marketing and SEO bundle for businesses targeting top search rankings and thought leadership.",
    category: "Premium & Scale",
    packages: [
      {
        name: "Premium Bundle",
        price: 22499,
        features: [
          "16 articles/month",
          "Full SEO suite",
          "Link building",
          "Content strategy",
          "Monthly audit",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-059",
    title: "Premium Paid Ads Management",
    description:
      "Full-service premium paid advertising management across Google, Meta, LinkedIn, and YouTube.",
    category: "Premium & Scale",
    packages: [
      {
        name: "Premium Ads",
        price: 27499,
        features: [
          "All major platforms",
          "Advanced targeting",
          "Creative production",
          "Daily optimization",
          "Weekly reporting",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── ENTERPRISE ────────────────────────────────────────────────────────────
  {
    id: "svc-060",
    title: "Enterprise Digital Marketing Suite",
    description:
      "End-to-end enterprise digital marketing solution with dedicated team, custom strategy, and full-service execution.",
    category: "Enterprise",
    packages: [
      {
        name: "Enterprise",
        price: 74999,
        features: [
          "Dedicated marketing team",
          "Custom strategy",
          "All channels",
          "Daily reporting",
          "Executive dashboard",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-061",
    title: "Enterprise SEO & Content Program",
    description:
      "Large-scale SEO and content marketing program for enterprise websites with hundreds of pages.",
    category: "Enterprise",
    packages: [
      {
        name: "Enterprise SEO",
        price: 39999,
        features: [
          "Unlimited keywords",
          "Technical SEO audit",
          "20+ articles/month",
          "Link building",
          "Dedicated SEO team",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-062",
    title: "Enterprise Paid Ads & Analytics",
    description:
      "Enterprise-grade paid advertising with advanced analytics, attribution modeling, and custom reporting.",
    category: "Enterprise",
    packages: [
      {
        name: "Enterprise Ads",
        price: 59999,
        features: [
          "All ad platforms",
          "Custom attribution",
          "Advanced analytics",
          "Dedicated ads team",
          "Real-time dashboard",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── WEB3 TOOLBOX ──────────────────────────────────────────────────────────
  {
    id: "svc-063",
    title: "Web3 Toolbox",
    description:
      "Complete Web3 marketing toolkit including NFT promotion, crypto community management, and blockchain project marketing.",
    category: "Web3 & Blockchain",
    packages: [
      {
        name: "Starter",
        price: 9999,
        features: [
          "Community setup (Discord/Telegram)",
          "Social media management",
          "NFT launch support",
          "Monthly report",
        ],
      },
      {
        name: "Growth",
        price: 22499,
        features: [
          "Full community management",
          "Influencer outreach",
          "Token launch marketing",
          "PR & media coverage",
          "Analytics",
        ],
      },
    ],
    addons: [
      { name: "Whitepaper Writing", price: 7499 },
      { name: "AMA Session Management", price: 2499 },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── EMAIL CAMPAIGN MANAGER ────────────────────────────────────────────────
  {
    id: "svc-064",
    title: "Email Campaign Manager",
    description:
      "Full-service email campaign management including strategy, design, copywriting, automation, and performance tracking.",
    category: "Email Marketing",
    packages: [
      {
        name: "Basic",
        price: 2999,
        features: [
          "3 campaigns/month",
          "Template design",
          "List management",
          "Open/click tracking",
        ],
      },
      {
        name: "Pro",
        price: 6999,
        features: [
          "8 campaigns/month",
          "Automation workflows",
          "Segmentation",
          "A/B testing",
          "Detailed analytics",
        ],
      },
      {
        name: "Enterprise",
        price: 12499,
        features: [
          "Unlimited campaigns",
          "Advanced automation",
          "CRM sync",
          "Dedicated manager",
          "Custom reporting",
        ],
      },
    ],
    addons: [
      { name: "List Cleaning & Verification", price: 1499 },
      { name: "Custom HTML Template Design", price: 2499 },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── PAID ADS TRACKER ──────────────────────────────────────────────────────
  {
    id: "svc-065",
    title: "Paid Ads Tracker",
    description:
      "Comprehensive paid advertising tracking and optimization service across Google, Meta, LinkedIn, and YouTube.",
    category: "Paid Ads",
    packages: [
      {
        name: "Basic",
        price: 3999,
        features: [
          "1 platform tracking",
          "Monthly performance report",
          "Budget optimization",
          "Conversion tracking",
        ],
      },
      {
        name: "Standard",
        price: 8999,
        features: [
          "3 platforms",
          "Bi-weekly reports",
          "Advanced optimization",
          "Audience insights",
          "ROI dashboard",
        ],
      },
      {
        name: "Pro",
        price: 17499,
        features: [
          "All platforms",
          "Weekly reports",
          "Real-time dashboard",
          "Attribution modeling",
          "Dedicated analyst",
        ],
      },
    ],
    addons: [
      { name: "Custom Analytics Dashboard", price: 3999 },
      { name: "Competitor Ad Spy Report", price: 2499 },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── LANDING PAGE BUILDER ──────────────────────────────────────────────────
  {
    id: "svc-066",
    title: "Landing Page Builder",
    description:
      "Professional landing page design and development service with conversion optimization and A/B testing.",
    category: "Web Development",
    packages: [
      {
        name: "Single Page",
        price: 4999,
        features: [
          "1 landing page",
          "Mobile responsive",
          "CTA optimization",
          "3 revisions",
          "Analytics integration",
        ],
      },
      {
        name: "Multi-Variant",
        price: 9999,
        features: [
          "1 page + 2 variants",
          "A/B testing setup",
          "Heatmap integration",
          "Conversion tracking",
          "5 revisions",
        ],
      },
      {
        name: "Funnel Pack",
        price: 17499,
        features: [
          "3-page funnel",
          "Lead capture forms",
          "Thank you pages",
          "Email integration",
          "Full analytics",
        ],
      },
    ],
    addons: [
      { name: "Copywriting", price: 1999 },
      { name: "Video Background Integration", price: 1499 },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── SEO ANALYSIS ──────────────────────────────────────────────────────────
  {
    id: "svc-067",
    title: "SEO Analysis",
    description:
      "In-depth SEO audit and analysis covering technical SEO, on-page factors, backlink profile, and competitor benchmarking.",
    category: "SEO",
    packages: [
      {
        name: "Basic Audit",
        price: 2499,
        features: [
          "Technical SEO audit",
          "On-page analysis",
          "Top 10 keyword gaps",
          "Action plan report",
        ],
      },
      {
        name: "Full Analysis",
        price: 5999,
        features: [
          "Complete technical audit",
          "Backlink analysis",
          "30 keyword gaps",
          "Competitor benchmarking",
          "Priority action plan",
        ],
      },
      {
        name: "Enterprise Audit",
        price: 12499,
        features: [
          "Full site crawl",
          "Core Web Vitals",
          "Schema markup review",
          "International SEO",
          "Executive report",
        ],
      },
    ],
    addons: [
      { name: "Monthly SEO Health Check", price: 1499 },
      { name: "Backlink Disavow Service", price: 1999 },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── PROJECT MANAGEMENT SUITE ──────────────────────────────────────────────
  {
    id: "svc-068",
    title: "Project Management Suite",
    description:
      "End-to-end project management for digital marketing campaigns including planning, execution, and reporting.",
    category: "Business & Agency",
    packages: [
      {
        name: "Basic",
        price: 3999,
        features: [
          "Campaign planning",
          "Task management",
          "Weekly status updates",
          "Basic reporting",
        ],
      },
      {
        name: "Standard",
        price: 8999,
        features: [
          "Full project management",
          "Team coordination",
          "Milestone tracking",
          "Client portal access",
          "Detailed reporting",
        ],
      },
      {
        name: "Pro",
        price: 17499,
        features: [
          "Dedicated project manager",
          "Agile workflow",
          "Real-time dashboards",
          "Risk management",
          "Executive reporting",
        ],
      },
    ],
    addons: [
      { name: "Custom Project Dashboard", price: 2499 },
      { name: "Stakeholder Reporting Pack", price: 1499 },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── DIGITAL ASSET MANAGER ─────────────────────────────────────────────────
  {
    id: "svc-069",
    title: "Digital Asset Manager",
    description:
      "Comprehensive digital asset management service including content library organization, brand asset creation, and distribution.",
    category: "Graphic Design",
    packages: [
      {
        name: "Starter",
        price: 2999,
        features: [
          "Asset library setup",
          "20 branded templates",
          "Brand guidelines",
          "Cloud storage organization",
        ],
      },
      {
        name: "Growth",
        price: 6999,
        features: [
          "50 branded templates",
          "Social media kit",
          "Presentation templates",
          "Email templates",
          "Monthly updates",
        ],
      },
      {
        name: "Enterprise",
        price: 13999,
        features: [
          "Unlimited templates",
          "Full brand asset library",
          "Video templates",
          "Custom illustrations",
          "Dedicated designer",
        ],
      },
    ],
    addons: [
      { name: "Custom Icon Set", price: 2499 },
      { name: "Brand Style Guide Document", price: 2999 },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── DATA & ANALYTICS ──────────────────────────────────────────────────────
  {
    id: "svc-070",
    title: "Data & Analytics",
    description:
      "Advanced data analytics and reporting service to turn your marketing data into actionable business insights.",
    category: "Analytics",
    packages: [
      {
        name: "Basic",
        price: 3999,
        features: [
          "GA4 + Search Console setup",
          "Monthly analytics report",
          "KPI dashboard",
          "Traffic analysis",
        ],
      },
      {
        name: "Advanced",
        price: 9999,
        features: [
          "Multi-channel analytics",
          "Custom dashboards",
          "Funnel analysis",
          "Attribution modeling",
          "Bi-weekly reports",
        ],
      },
      {
        name: "Enterprise",
        price: 22499,
        features: [
          "Full data stack setup",
          "Real-time dashboards",
          "Predictive analytics",
          "Custom data pipelines",
          "Dedicated analyst",
        ],
      },
    ],
    addons: [
      { name: "Custom Looker Studio Dashboard", price: 3999 },
      { name: "Data Audit & Cleanup", price: 2499 },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── SOCIAL MEDIA CONTENT PACKS ────────────────────────────────────────────
  {
    id: "svc-071",
    title: "Instagram Growth Pack",
    description:
      "Dedicated Instagram growth service with content creation, hashtag strategy, engagement, and follower growth.",
    category: "Social Media",
    packages: [
      {
        name: "Starter",
        price: 3499,
        features: [
          "12 posts/month",
          "Stories",
          "Hashtag research",
          "Engagement management",
        ],
      },
      {
        name: "Growth",
        price: 6999,
        features: [
          "20 posts/month",
          "Reels (4/month)",
          "Stories daily",
          "Influencer outreach",
          "Monthly analytics",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-072",
    title: "LinkedIn Brand Building",
    description:
      "Professional LinkedIn presence management for personal brands and companies with thought leadership content.",
    category: "Social Media",
    packages: [
      {
        name: "Personal Brand",
        price: 3999,
        features: [
          "Profile optimization",
          "12 posts/month",
          "Connection strategy",
          "Engagement management",
        ],
      },
      {
        name: "Company Page",
        price: 7499,
        features: [
          "Company page management",
          "16 posts/month",
          "Employee advocacy",
          "Lead generation",
          "Analytics",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-073",
    title: "YouTube Channel Management",
    description:
      "Complete YouTube channel management including video optimization, thumbnail design, and audience growth.",
    category: "Social Media",
    packages: [
      {
        name: "Basic",
        price: 4999,
        features: [
          "Channel optimization",
          "4 video uploads/month",
          "Thumbnail design",
          "SEO optimization",
          "Monthly report",
        ],
      },
      {
        name: "Pro",
        price: 10999,
        features: [
          "8 video uploads/month",
          "Custom thumbnails",
          "End screens & cards",
          "Community posts",
          "Analytics dashboard",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── CONTENT CREATION PACKS ────────────────────────────────────────────────
  {
    id: "svc-074",
    title: "Podcast Production & Marketing",
    description:
      "End-to-end podcast production, editing, and marketing to grow your audience and brand authority.",
    category: "Content Marketing",
    packages: [
      {
        name: "Basic",
        price: 3999,
        features: [
          "4 episodes/month",
          "Audio editing",
          "Show notes",
          "Distribution to major platforms",
        ],
      },
      {
        name: "Pro",
        price: 8999,
        features: [
          "8 episodes/month",
          "Audio + video editing",
          "Audiogram clips",
          "Social promotion",
          "Guest outreach",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-075",
    title: "Infographic Design Pack",
    description:
      "Custom infographic design for data visualization, process flows, and educational content marketing.",
    category: "Graphic Design",
    packages: [
      {
        name: "Basic",
        price: 1799,
        features: [
          "2 infographics/month",
          "Data visualization",
          "Brand-consistent design",
          "Web + print formats",
        ],
      },
      {
        name: "Pro",
        price: 3999,
        features: [
          "5 infographics/month",
          "Interactive versions",
          "Animated GIF versions",
          "Social media adaptations",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── LOCAL MARKETING ───────────────────────────────────────────────────────
  {
    id: "svc-076",
    title: "Local SEO & Maps Optimization",
    description:
      "Dominate local search results with Google Maps optimization, local citations, and review management.",
    category: "SEO",
    packages: [
      {
        name: "Basic",
        price: 2999,
        features: [
          "GMB optimization",
          "10 local citations",
          "Review management",
          "Monthly report",
        ],
      },
      {
        name: "Pro",
        price: 6999,
        features: [
          "Full GMB management",
          "30 local citations",
          "Local link building",
          "Competitor analysis",
          "Weekly updates",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-077",
    title: "WhatsApp Marketing Campaigns",
    description:
      "Targeted WhatsApp marketing campaigns with broadcast messages, catalog setup, and customer engagement.",
    category: "Automation & AI",
    packages: [
      {
        name: "Basic",
        price: 2499,
        features: [
          "Campaign setup",
          "4 broadcasts/month",
          "Message templates",
          "Basic analytics",
        ],
      },
      {
        name: "Pro",
        price: 5999,
        features: [
          "8 broadcasts/month",
          "Catalog setup",
          "Automated follow-ups",
          "Click tracking",
          "Detailed analytics",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── CONVERSION RATE OPTIMIZATION ─────────────────────────────────────────
  {
    id: "svc-078",
    title: "Conversion Rate Optimization (CRO)",
    description:
      "Data-driven CRO service to improve website conversion rates through testing, analysis, and optimization.",
    category: "Analytics",
    packages: [
      {
        name: "Basic",
        price: 5999,
        features: [
          "Heatmap analysis",
          "User session recordings",
          "CRO audit",
          "3 A/B tests/month",
        ],
      },
      {
        name: "Advanced",
        price: 13999,
        features: [
          "Full CRO program",
          "Multivariate testing",
          "User research",
          "Funnel optimization",
          "Monthly CRO report",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── SOCIAL MEDIA ADS ──────────────────────────────────────────────────────
  {
    id: "svc-079",
    title: "YouTube Ads Management",
    description:
      "YouTube advertising campaigns including TrueView, bumper ads, and discovery ads with full optimization.",
    category: "Paid Ads",
    packages: [
      {
        name: "Starter",
        price: 4499,
        features: [
          "Campaign setup",
          "Ad creative guidance",
          "Audience targeting",
          "Monthly report",
        ],
      },
      {
        name: "Growth",
        price: 8999,
        features: [
          "Multiple ad formats",
          "Retargeting",
          "A/B testing",
          "Bi-weekly optimization",
          "Analytics dashboard",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-080",
    title: "Pinterest & Twitter Ads",
    description:
      "Niche platform advertising on Pinterest and Twitter/X for brand awareness and targeted audience reach.",
    category: "Paid Ads",
    packages: [
      {
        name: "Pinterest Ads",
        price: 3999,
        features: [
          "Campaign setup",
          "Pin design",
          "Audience targeting",
          "Monthly report",
        ],
      },
      {
        name: "Twitter/X Ads",
        price: 3999,
        features: [
          "Promoted tweets",
          "Follower campaigns",
          "Trend targeting",
          "Monthly report",
        ],
      },
      {
        name: "Both Platforms",
        price: 6999,
        features: [
          "Pinterest + Twitter/X",
          "Cross-platform strategy",
          "Combined reporting",
          "Optimization",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── DIGITAL PR ────────────────────────────────────────────────────────────
  {
    id: "svc-081",
    title: "Digital PR & Media Outreach",
    description:
      "Strategic digital PR campaigns to earn media coverage, backlinks, and brand mentions from top publications.",
    category: "Content Marketing",
    packages: [
      {
        name: "Basic",
        price: 7499,
        features: [
          "Press release writing",
          "5 media pitches/month",
          "Basic media list",
          "Coverage report",
        ],
      },
      {
        name: "Pro",
        price: 17499,
        features: [
          "3 press releases/month",
          "20 media pitches",
          "Journalist relationships",
          "Crisis PR support",
          "Monthly coverage report",
        ],
      },
    ],
    isActive: true,
    isVisible: true,
  },

  // ── NEW SERVICES ──────────────────────────────────────────────────────────

  // Social Media Combo Packs
  {
    id: "svc-082",
    title: "Social Media Full Management – Basic",
    description:
      "All-in-one social media management covering content creation, scheduling, engagement, and reporting for 2 platforms.",
    category: "Social Media",
    packages: [
      {
        name: "Basic",
        price: 4999,
        features: [
          "2 platforms",
          "15 posts/month",
          "Story creation",
          "Comment management",
          "Monthly analytics report",
        ],
      },
    ],
    addons: [
      { name: "Extra Platform", price: 1299 },
      { name: "Reel/Short Video (4/month)", price: 1999 },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-083",
    title: "Social Media Full Management – Standard",
    description:
      "Comprehensive social media management for 3 platforms with reels, stories, and bi-weekly strategy calls.",
    category: "Social Media",
    packages: [
      {
        name: "Standard",
        price: 8999,
        features: [
          "3 platforms",
          "24 posts/month",
          "8 reels/month",
          "Stories daily",
          "Bi-weekly strategy call",
          "Detailed analytics",
        ],
      },
    ],
    addons: [
      { name: "Paid Ad Management", price: 3999 },
      { name: "Influencer Collaboration (1/month)", price: 2999 },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-084",
    title: "Social Media Full Management – Premium",
    description:
      "Premium social media management for 5 platforms with full content production, influencer tie-ups, and weekly reporting.",
    category: "Social Media",
    packages: [
      {
        name: "Premium",
        price: 14999,
        features: [
          "5 platforms",
          "40 posts/month",
          "12 reels/month",
          "Stories + highlights",
          "Influencer tie-up (1/month)",
          "Weekly reporting",
          "Dedicated manager",
        ],
      },
    ],
    addons: [
      { name: "Additional Influencer Collaboration", price: 3999 },
      { name: "Monthly Photoshoot Coordination", price: 4999 },
    ],
    isActive: true,
    isVisible: true,
  },

  // SEO Combo Packs
  {
    id: "svc-085",
    title: "SEO Starter Pack",
    description:
      "Entry-level SEO package with keyword research, on-page optimization, and monthly ranking reports.",
    category: "SEO",
    packages: [
      {
        name: "Starter",
        price: 3999,
        features: [
          "15 keywords",
          "On-page SEO (10 pages)",
          "Google Search Console setup",
          "Monthly ranking report",
        ],
      },
    ],
    addons: [
      { name: "Blog Writing (2 posts)", price: 1499 },
      { name: "Local SEO Add-on", price: 1299 },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-086",
    title: "SEO Growth Pack",
    description:
      "Mid-tier SEO package with technical audit, link building, content optimization, and bi-weekly reporting.",
    category: "SEO",
    packages: [
      {
        name: "Growth",
        price: 7499,
        features: [
          "30 keywords",
          "Technical SEO audit",
          "On-page + off-page",
          "5 backlinks/month",
          "Bi-weekly report",
        ],
      },
    ],
    addons: [
      { name: "Blog Writing (4 posts)", price: 2499 },
      { name: "Competitor Analysis Report", price: 1999 },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-087",
    title: "SEO Pro Pack",
    description:
      "Advanced SEO package with unlimited keywords, aggressive link building, and dedicated SEO manager.",
    category: "SEO",
    packages: [
      {
        name: "Pro",
        price: 13999,
        features: [
          "50 keywords",
          "Full technical SEO",
          "15 backlinks/month",
          "Content strategy",
          "Weekly reporting",
          "Dedicated SEO manager",
        ],
      },
    ],
    addons: [
      { name: "Blog Writing (8 posts)", price: 4499 },
      { name: "Video SEO Optimization", price: 2499 },
    ],
    isActive: true,
    isVisible: true,
  },

  // Paid Ads Combo Packs
  {
    id: "svc-088",
    title: "Google Ads Starter Pack",
    description:
      "Google Ads setup and management for small businesses with search campaigns and monthly optimization.",
    category: "Paid Ads",
    packages: [
      {
        name: "Starter",
        price: 4499,
        features: [
          "Search campaign setup",
          "Keyword research",
          "Ad copywriting",
          "Monthly optimization",
          "Performance report",
        ],
      },
    ],
    addons: [
      { name: "Display Campaign Add-on", price: 1499 },
      { name: "Shopping Campaign Setup", price: 2499 },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-089",
    title: "Meta Ads Growth Pack",
    description:
      "Facebook and Instagram ads management with retargeting, lookalike audiences, and creative strategy.",
    category: "Paid Ads",
    packages: [
      {
        name: "Growth",
        price: 6499,
        features: [
          "FB + IG campaigns",
          "Retargeting setup",
          "Lookalike audiences",
          "Creative strategy",
          "Bi-weekly optimization",
        ],
      },
    ],
    addons: [
      { name: "Ad Creative Design (5 creatives)", price: 1999 },
      { name: "WhatsApp Click-to-Chat Ads", price: 1499 },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-090",
    title: "Full-Funnel Ads Management Pack",
    description:
      "Complete paid advertising management across Google, Meta, and YouTube with full-funnel strategy.",
    category: "Paid Ads",
    packages: [
      {
        name: "Full Funnel",
        price: 12499,
        features: [
          "Google + Meta + YouTube",
          "Full-funnel strategy",
          "Retargeting",
          "A/B testing",
          "Weekly reporting",
          "Dedicated ads manager",
        ],
      },
    ],
    addons: [
      { name: "LinkedIn Ads Add-on", price: 3999 },
      { name: "Landing Page Optimization", price: 2499 },
    ],
    isActive: true,
    isVisible: true,
  },

  // Content Creation Packs
  {
    id: "svc-091",
    title: "Content Creation Starter Pack",
    description:
      "Monthly content creation bundle including social media posts, stories, and basic graphic design.",
    category: "Content Marketing",
    packages: [
      {
        name: "Starter",
        price: 3499,
        features: [
          "15 social media posts",
          "10 story designs",
          "2 blog posts",
          "Basic graphic design",
        ],
      },
    ],
    addons: [
      { name: "Reel Script + Editing (2/month)", price: 1999 },
      { name: "Email Newsletter Design", price: 1299 },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-092",
    title: "Content Creation Pro Pack",
    description:
      "Premium content creation with reels, carousels, long-form blogs, and video scripts for maximum engagement.",
    category: "Content Marketing",
    packages: [
      {
        name: "Pro",
        price: 8499,
        features: [
          "30 social media posts",
          "20 story designs",
          "4 reels/month",
          "4 blog posts",
          "Video scripts",
          "Carousel designs",
        ],
      },
    ],
    addons: [
      { name: "Podcast Episode Production", price: 2499 },
      { name: "Infographic Design (2/month)", price: 1999 },
    ],
    isActive: true,
    isVisible: true,
  },

  // Website & Tech Packs
  {
    id: "svc-093",
    title: "WordPress Website Pack",
    description:
      "Professional WordPress website design and development with SEO setup and mobile optimization.",
    category: "Web Development",
    packages: [
      {
        name: "Basic",
        price: 8999,
        features: [
          "5-page WordPress site",
          "Mobile responsive",
          "Basic SEO",
          "Contact form",
          "3 revisions",
        ],
      },
      {
        name: "Standard",
        price: 15999,
        features: [
          "10-page WordPress site",
          "WooCommerce ready",
          "Advanced SEO",
          "Speed optimization",
          "5 revisions",
        ],
      },
    ],
    addons: [
      { name: "Blog Setup & Migration", price: 2499 },
      { name: "Maintenance Plan (monthly)", price: 1499 },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-094",
    title: "Shopify Store Setup",
    description:
      "Complete Shopify store setup with product listings, payment gateway, and conversion optimization.",
    category: "Web Development",
    packages: [
      {
        name: "Starter",
        price: 12499,
        features: [
          "Store setup",
          "Up to 30 products",
          "Payment gateway",
          "Mobile responsive",
          "Basic SEO",
        ],
      },
      {
        name: "Growth",
        price: 22499,
        features: [
          "Up to 100 products",
          "Custom theme",
          "App integrations",
          "Email marketing setup",
          "Analytics",
        ],
      },
    ],
    addons: [
      { name: "Product Photography Editing (20 images)", price: 2499 },
      { name: "Abandoned Cart Email Setup", price: 1999 },
    ],
    isActive: true,
    isVisible: true,
  },

  // Branding Packs
  {
    id: "svc-095",
    title: "Complete Brand Identity Pack",
    description:
      "Full brand identity creation including logo, color palette, typography, brand guidelines, and all brand collateral.",
    category: "Graphic Design",
    packages: [
      {
        name: "Essential",
        price: 5999,
        features: [
          "Logo (3 concepts)",
          "Color palette",
          "Typography",
          "Business card design",
          "Brand guidelines PDF",
        ],
      },
      {
        name: "Complete",
        price: 12499,
        features: [
          "Logo + variations",
          "Full brand kit",
          "Stationery design",
          "Social media kit",
          "Presentation template",
          "Brand guidelines doc",
        ],
      },
    ],
    addons: [
      { name: "Brand Video Intro (15 sec)", price: 3999 },
      { name: "Merchandise Design (T-shirt, mug)", price: 2499 },
    ],
    isActive: true,
    isVisible: true,
  },

  // Combo / All-in-One Packs
  {
    id: "svc-096",
    title: "Digital Marketing Starter Bundle",
    description:
      "All-in-one starter bundle combining social media, SEO, and content creation for new businesses.",
    category: "Business & Agency",
    packages: [
      {
        name: "Bundle",
        price: 9999,
        features: [
          "Social media management (2 platforms)",
          "Basic SEO (10 keywords)",
          "4 blog posts/month",
          "Monthly strategy call",
          "Performance report",
        ],
      },
    ],
    addons: [
      { name: "Google Ads Setup", price: 2499 },
      { name: "Brand Identity Design", price: 3999 },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-097",
    title: "Digital Marketing Growth Bundle",
    description:
      "Comprehensive growth bundle with social media, SEO, paid ads, and email marketing for scaling businesses.",
    category: "Business & Agency",
    packages: [
      {
        name: "Growth Bundle",
        price: 19999,
        features: [
          "Social media (3 platforms)",
          "SEO (25 keywords)",
          "Google + Meta Ads",
          "Email marketing (4 campaigns)",
          "Bi-weekly strategy calls",
          "Full analytics dashboard",
        ],
      },
    ],
    addons: [
      { name: "Influencer Marketing (2/month)", price: 4999 },
      { name: "Video Content (4 reels/month)", price: 3999 },
    ],
    isActive: true,
    isVisible: true,
  },
  {
    id: "svc-098",
    title: "Digital Marketing Premium Bundle",
    description:
      "Premium all-inclusive digital marketing bundle for established businesses targeting aggressive growth.",
    category: "Business & Agency",
    packages: [
      {
        name: "Premium Bundle",
        price: 34999,
        features: [
          "Social media (5 platforms)",
          "Full SEO suite",
          "All major ad platforms",
          "Email + WhatsApp marketing",
          "Content creation",
          "Weekly reporting",
          "Dedicated account manager",
        ],
      },
    ],
    addons: [
      { name: "PR & Media Outreach", price: 7499 },
      { name: "CRO Audit & Implementation", price: 5999 },
    ],
    isActive: true,
    isVisible: true,
  },
];
