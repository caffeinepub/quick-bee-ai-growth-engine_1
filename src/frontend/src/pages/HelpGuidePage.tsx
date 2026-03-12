import {
  BarChart3,
  Bot,
  Briefcase,
  CalendarDays,
  CalendarRange,
  Cpu,
  Download,
  GitBranch,
  Globe,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  ListChecks,
  Mail,
  Megaphone,
  Monitor,
  PenTool,
  Plug,
  Radio,
  RefreshCw,
  Search,
  Settings,
  Settings2,
  ShoppingCart,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Webhook,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";

interface HelpItem {
  icon: React.ElementType;
  label: string;
  path: string;
  description: string;
  howTo: string[];
  tips?: string;
}

interface HelpSection {
  group: string;
  color: string;
  items: HelpItem[];
}

const helpSections: HelpSection[] = [
  {
    group: "Main",
    color: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    items: [
      {
        icon: LayoutDashboard,
        label: "Dashboard",
        path: "/",
        description:
          "Your central command center showing key performance metrics, recent leads, revenue summary, and quick access to all modules.",
        howTo: [
          "View live KPIs: total leads, revenue, active services, and conversion rate at the top.",
          "Use the Smart Lead Capture form at the bottom to add a lead instantly.",
          "Charts update automatically every 15 seconds from the backend.",
        ],
        tips: "Bookmark this page as your daily starting point.",
      },
      {
        icon: Users,
        label: "Lead Management",
        path: "/leads",
        description:
          "Full CRM pipeline. Add, edit, delete, and track leads through New → Contacted → Qualified → Proposal Sent → Closed Won.",
        howTo: [
          "Click 'Add Lead' to create a new lead. Name is required; all other fields are optional.",
          "Switch between Table view (list) and Kanban view (pipeline board) using the toggle.",
          "Use the Status filter dropdown to view only leads at a specific stage.",
          "Click the edit (pencil) icon on any row to update a lead's details or status.",
          "Import leads in bulk using the Import button — supports Excel, CSV, Google Sheets export, and PDF.",
          "Export your leads as CSV, Excel, or PDF using the Export button.",
        ],
        tips: "Status 'New' is the default. If a lead is not accepting saves, ensure the Name field is filled.",
      },
      {
        icon: Briefcase,
        label: "Services Catalog",
        path: "/services",
        description:
          "Browse and purchase all 35+ agency services. Filter by category, add services to your cart, and proceed to checkout.",
        howTo: [
          "Use the category filter tabs to browse by type: AI, Marketing, Development, etc.",
          "Click 'Add to Cart' on any service card to add it for purchase.",
          "View the cart counter in the sidebar next to Checkout.",
          "Only visible services appear here — manage visibility in Service Management.",
        ],
      },
      {
        icon: Settings2,
        label: "Service Management",
        path: "/service-management",
        description:
          "Add, edit, delete, duplicate, reorder, and toggle visibility of services in your catalog.",
        howTo: [
          "Click 'Add Service' to create a new service with title, category, description, packages, and pricing.",
          "Use the eye icon toggle to show or hide a service from the catalog.",
          "Click the duplicate icon to copy an existing service.",
          "Drag services to reorder them in the catalog.",
          "Import services from Excel or CSV, or export your full list.",
        ],
        tips: "All prices should end in 99 or 999 (no zeros) as per your pricing policy.",
      },
      {
        icon: Bot,
        label: "AI Smart Systems",
        path: "/ai-tools",
        description:
          "AI-powered tools for revenue forecasting, business intelligence, competitive analysis, and automated planning.",
        howTo: [
          "Select a tool from the available AI systems listed.",
          "Enter the required inputs (business data, goals, metrics).",
          "Click Run or Generate to receive AI-generated insights and recommendations.",
          "Copy or export results for use in proposals or planning docs.",
        ],
      },
      {
        icon: Settings,
        label: "Sales Config",
        path: "/settings",
        description:
          "Configure your sales pipeline, deal stages, follow-up templates, and target revenue settings.",
        howTo: [
          "Set your monthly revenue target and sales cycle length.",
          "Define custom follow-up message templates for each pipeline stage.",
          "Configure commission rates if tracking team sales.",
          "Save changes using the Save button — settings persist across sessions.",
        ],
      },
      {
        icon: Zap,
        label: "Automation",
        path: "/automation",
        description:
          "Configure and activate automated workflows for lead follow-ups, email sequences, task creation, and status updates.",
        howTo: [
          "Enable or disable individual automations using the toggle on each card.",
          "Set trigger conditions: e.g., 'When a lead reaches Qualified, send a proposal template'.",
          "Connect to Make (Integromat) via Webhook Settings for external automation.",
        ],
        tips: "Automated emails require an external tool like Make. Use Webhook Settings to connect.",
      },
      {
        icon: GitBranch,
        label: "Workflows",
        path: "/workflows",
        description:
          "Build multi-step automation workflows that chain triggers, conditions, and actions together visually.",
        howTo: [
          "Click 'New Workflow' to create a workflow from scratch.",
          "Add trigger (e.g., new lead added), conditions (e.g., status = New), and actions (e.g., send webhook).",
          "Activate the workflow using the toggle. It will run automatically when conditions are met.",
          "View run history to see how many times a workflow has executed.",
        ],
      },
      {
        icon: BarChart3,
        label: "Analytics Engine",
        path: "/analytics",
        description:
          "Deep analytics on leads, revenue, conversion rates, service performance, and growth trends over time.",
        howTo: [
          "Use date range filters to view metrics for a specific period.",
          "Switch between chart types: bar, line, pie, using the view controls.",
          "The funnel chart shows drop-off between pipeline stages.",
          "Export charts or data tables using the download button on each widget.",
        ],
      },
      {
        icon: PenTool,
        label: "AI Content",
        path: "/content-creator",
        description:
          "Generate marketing content — social posts, email copy, ad headlines, blog outlines, and proposal text using AI.",
        howTo: [
          "Select the content type from the dropdown (social post, email, ad, etc.).",
          "Enter your topic, target audience, and tone.",
          "Click 'Generate' to produce the content.",
          "Copy the result or click 'Regenerate' to get a new version.",
        ],
      },
      {
        icon: Webhook,
        label: "Webhook Logs",
        path: "/webhook-logs",
        description:
          "View a log of all incoming webhook events received from external tools like Make, Zapier, or custom systems.",
        howTo: [
          "Each log entry shows the source, tool name, timestamp, and payload.",
          "Use this to verify that your Make/Zapier automations are correctly sending data.",
          "Click on a log entry to expand and see the full payload.",
          "Use the Clear Logs button to remove old entries.",
        ],
      },
      {
        icon: ShoppingCart,
        label: "Checkout",
        path: "/checkout",
        description:
          "Review your cart and complete payment for selected services using Razorpay.",
        howTo: [
          "Add services to cart from the Services Catalog page.",
          "Review the cart items and total here.",
          "Click 'Proceed to Payment' to complete the transaction via Razorpay.",
          "After payment, you'll be redirected to the success page.",
        ],
      },
      {
        icon: Download,
        label: "Data Export",
        path: "/data-export",
        description:
          "Export all your app data — leads, services, and metrics — in bulk as CSV, Excel, or PDF.",
        howTo: [
          "Select the data category you want to export (Leads, Services, etc.).",
          "Choose the format: CSV, Excel, or PDF.",
          "Click Export — the file will download immediately.",
        ],
      },
      {
        icon: RefreshCw,
        label: "Cross-Device Sync",
        path: "/data-sync",
        description:
          "Information page about how live data sync works across all devices via the backend canister.",
        howTo: [
          "All leads and services are automatically synced across devices every 15 seconds.",
          "No manual action is needed — just open the app on any device.",
          "A green 'Live' badge on each page confirms the sync connection is active.",
        ],
        tips: "If data appears stale, refresh the page to force an immediate sync.",
      },
    ],
  },
  {
    group: "Social Media",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    items: [
      {
        icon: CalendarDays,
        label: "Social Scheduler",
        path: "/social-scheduler",
        description:
          "Plan and schedule social media posts across platforms (Facebook, Instagram, LinkedIn, Twitter, YouTube, TikTok).",
        howTo: [
          "Click 'New Post' to create a post with title, caption, platform, and scheduled date.",
          "Set status to 'Scheduled', 'Draft', 'Published', or 'Cancelled'.",
          "Add hashtags and notes to each post.",
          "View, edit, or delete posts from the table.",
        ],
      },
      {
        icon: CalendarRange,
        label: "Content Calendar",
        path: "/content-calendar",
        description:
          "A calendar view of all scheduled and published content, organized by date.",
        howTo: [
          "Navigate months using the arrow buttons.",
          "Click on a date to see posts scheduled for that day.",
          "Posts are color-coded by platform.",
          "Click any post to edit its details directly.",
        ],
      },
      {
        icon: TrendingUp,
        label: "Metrics Dashboard",
        path: "/social-metrics",
        description:
          "Track social media KPIs: followers, impressions, reach, engagement, and clicks by platform and date.",
        howTo: [
          "Click 'Add Metrics' to enter performance data for a platform on a specific date.",
          "View charts comparing metrics over time.",
          "Filter by platform using the dropdown.",
          "Edit existing entries using the edit icon.",
        ],
      },
      {
        icon: Radio,
        label: "External Webhooks",
        path: "/external-webhooks",
        description:
          "Configure incoming webhook endpoints from external tools that push data into your app.",
        howTo: [
          "Add a webhook source URL and assign it to a tool name.",
          "When the external tool fires, the payload is received and logged.",
          "View received data in Webhook Logs.",
        ],
      },
      {
        icon: Plug,
        label: "External Tools",
        path: "/external-tools",
        description:
          "Connect and manage integrations with external platforms like Make, Zapier, Razorpay, and Calendly.",
        howTo: [
          "View the list of supported integrations.",
          "Click 'Connect' or 'Configure' on each tool to set it up.",
          "Enter API keys, webhook URLs, or access tokens as required.",
          "Test the connection using the 'Test' button.",
        ],
      },
    ],
  },
  {
    group: "Digital Marketing",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    items: [
      {
        icon: Search,
        label: "SEO Manager",
        path: "/digital-marketing/seo",
        description:
          "Track and manage SEO entries for your pages: target keywords, meta titles, and meta descriptions.",
        howTo: [
          "Click 'Add Entry' to create a new SEO record for a page URL.",
          "Enter target keywords (comma-separated), meta title, and meta description.",
          "Edit existing entries to update metadata as your content evolves.",
          "Use this data to guide your on-page SEO optimization.",
        ],
      },
      {
        icon: Mail,
        label: "Email Campaigns",
        path: "/digital-marketing/email-campaigns",
        description:
          "Plan and track email campaigns: subject lines, body content, target audience, and send status.",
        howTo: [
          "Click 'New Campaign' to create a campaign record.",
          "Fill in campaign name, subject line, body, and target audience.",
          "Set status to Draft, Active, or Sent.",
          "Use this as a planning and tracking tool — actual email sending requires Make/Zapier integration.",
        ],
        tips: "Automated email delivery requires connecting your Make webhook in Webhook Settings.",
      },
      {
        icon: Megaphone,
        label: "Ads Tracker",
        path: "/digital-marketing/ads-tracker",
        description:
          "Log and monitor paid advertising campaigns across Google Ads, Meta, LinkedIn, and YouTube.",
        howTo: [
          "Click 'Add Campaign' to log a new ad campaign.",
          "Enter platform, budget, spend, impressions, clicks, and conversions.",
          "View performance charts comparing campaigns side-by-side.",
          "Edit entries as actual results come in to track ROI.",
        ],
      },
      {
        icon: Globe,
        label: "Landing Pages",
        path: "/digital-marketing/landing-pages",
        description:
          "Track landing pages associated with your campaigns: URLs, conversion goals, and performance status.",
        howTo: [
          "Click 'New Landing Page' to create a record.",
          "Link it to a campaign and set a conversion goal.",
          "Set status to Active, Draft, or Paused.",
          "Monitor which pages are driving conversions.",
        ],
      },
      {
        icon: LineChart,
        label: "DM Analytics",
        path: "/digital-marketing/analytics",
        description:
          "Consolidated view of all digital marketing performance: email, ads, SEO, and landing page metrics together.",
        howTo: [
          "View aggregate performance across all channels.",
          "Use date filters to narrow results to a campaign period.",
          "Compare channel ROI using the side-by-side breakdown.",
        ],
      },
    ],
  },
  {
    group: "AI Agent",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    items: [
      {
        icon: ListChecks,
        label: "Smart Task Agent",
        path: "/smart-task-agent",
        description:
          "An AI-powered task manager that auto-generates action items based on your leads, pipeline stage, and goals.",
        howTo: [
          "Click 'Generate Tasks' to let the AI analyze your current pipeline and suggest priority tasks.",
          "Mark tasks complete using the checkbox.",
          "Add manual tasks using the 'Add Task' button.",
          "Tasks are sorted by urgency and due date.",
        ],
      },
      {
        icon: Cpu,
        label: "Campaign Autopilot",
        path: "/campaign-autopilot",
        description:
          "AI-driven campaign planning that auto-generates a full marketing campaign brief — channels, schedule, budget, and messaging.",
        howTo: [
          "Enter your campaign goal, target audience, and budget.",
          "Click 'Generate Campaign Plan' to get a full AI-generated strategy.",
          "Review and edit the generated plan.",
          "Export it as a PDF or copy for use in proposals.",
        ],
      },
    ],
  },
  {
    group: "Growth Tools",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
    items: [
      {
        icon: Search,
        label: "Website Audit",
        path: "/website-audit",
        description:
          "Offer prospects a free AI-powered website audit. Visitors submit their business name and URL and receive a simulated report covering SEO, conversion, and marketing insights.",
        howTo: [
          "Share the link to this page with your prospects.",
          "Visitors fill in their business name and website URL and click 'Run Audit'.",
          "A simulated audit report is generated covering SEO score, conversion suggestions, and marketing recommendations.",
          "The submission is automatically saved as a lead in Lead Management.",
        ],
        tips: "Use this as a lead magnet — share the link on social media or in emails.",
      },
      {
        icon: Monitor,
        label: "Demo Previews",
        path: "/demo-preview",
        description:
          "Showcase AI-generated website examples for different industries. Prospects can request a custom demo redesign.",
        howTo: [
          "Browse industry examples (restaurant, clinic, real estate, salon, etc.).",
          "Each card has a 'Request My Demo' button.",
          "When clicked, the visitor's interest is captured as a lead.",
          "Use this to convert website visitors into consultation requests.",
        ],
      },
      {
        icon: CalendarDays,
        label: "Book Consultation",
        path: "/book-consultation",
        description:
          "A booking form for prospects to schedule a consultation call. All bookings are saved as leads in your pipeline.",
        howTo: [
          "Share this page link with prospects.",
          "Visitors fill in their name, email, phone, preferred date/time, and topic.",
          "On submission, the booking is saved as a lead with status 'New'.",
          "If a Make webhook is configured in Webhook Settings, the booking also fires to your automation.",
        ],
      },
      {
        icon: LayoutDashboard,
        label: "Admin Dashboard",
        path: "/admin-dashboard",
        description:
          "A protected overview panel showing all growth tool submissions: total leads, audit requests, demo requests, bookings, and conversion stats.",
        howTo: [
          "View total lead count, new leads today, and conversion rate.",
          "See a breakdown of leads by source: manual, audit, demo, booking, smart capture.",
          "Charts show submission trends over time.",
          "This page is not listed in search results — access it directly via the sidebar.",
        ],
      },
      {
        icon: Target,
        label: "Lead Capture",
        path: "/smart-lead-capture",
        description:
          "A dedicated smart lead capture form that collects full prospect details (name, email, phone, business, website) and saves them directly to your pipeline.",
        howTo: [
          "Embed or share this page as a contact/inquiry form.",
          "Fill in all fields and click 'Submit'.",
          "The lead is instantly saved to Lead Management with status 'New'.",
          "If a Make webhook URL is set in Webhook Settings, the data is also sent to your automation workflow.",
        ],
        tips: "Ideal for embedding in ad landing pages or sharing via WhatsApp/email.",
      },
      {
        icon: UserCheck,
        label: "Client Onboarding",
        path: "/client-onboarding",
        description:
          "When a lead is marked 'Closed Won', create a client record with a 6-step onboarding checklist and project tracking.",
        howTo: [
          "Go to Lead Management and change a lead's status to 'Closed Won'.",
          "Come back here and click 'Create Client from Lead' — the lead will appear in the dropdown.",
          "A client record is created with onboarding steps: Contract, Kickoff, Access, Brief, Delivery, Reporting.",
          "Check off each step as it's completed. Status updates automatically (Onboarding → Active → Completed).",
        ],
      },
      {
        icon: Webhook,
        label: "Webhook Settings",
        path: "/webhook-integration",
        description:
          "Configure Make (Integromat) or Zapier webhook URLs so every form submission (lead capture, audit, booking) automatically fires to your external automation.",
        howTo: [
          "Paste your Make/Zapier webhook URL into the appropriate slot (Lead Capture, Audit, Demo, Booking).",
          "Toggle each webhook Active or Inactive.",
          "Click 'Test' to send a sample payload and verify the connection.",
          "When a visitor submits any growth tool form, it fires to the webhook automatically.",
        ],
        tips: "Get your webhook URL from Make by creating a new scenario with an HTTP webhook trigger.",
      },
    ],
  },
];

export function HelpGuidePage() {
  const [activeGroup, setActiveGroup] = useState<string>("Main");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const allGroups = helpSections.map((s) => s.group);
  const activeSection = helpSections.find((s) => s.group === activeGroup);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <HelpCircle className="w-7 h-7" style={{ color: "#00d4c8" }} />
          <h1 className="text-2xl font-bold text-foreground">Help Guide</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Step-by-step instructions for every section of Quick Bee AI Growth
          Engine.
        </p>
      </div>

      {/* Group tabs */}
      <div className="flex flex-wrap gap-2">
        {allGroups.map((group) => (
          <button
            key={group}
            type="button"
            onClick={() => {
              setActiveGroup(group);
              setExpandedItem(null);
            }}
            data-ocid="help.group.tab"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
              activeGroup === group
                ? "border-teal-500/50 text-teal-400 bg-teal-500/10"
                : "border-white/10 text-white/50 hover:text-white/80 hover:border-white/20 bg-transparent"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Items */}
      {activeSection && (
        <div className="space-y-3">
          {activeSection.items.map((item) => {
            const Icon = item.icon;
            const isOpen = expandedItem === item.label;
            return (
              <Card
                key={item.label}
                className={`border transition-all duration-200 ${
                  isOpen
                    ? "border-teal-500/40 bg-teal-500/5"
                    : "border-white/8 hover:border-white/15"
                }`}
              >
                <CardContent className="p-0">
                  {/* Header row */}
                  <button
                    type="button"
                    className="w-full flex items-center gap-4 p-4 text-left"
                    onClick={() => setExpandedItem(isOpen ? null : item.label)}
                    data-ocid="help.item.toggle"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${activeSection.color}`}
                    >
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">
                          {item.label}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs font-mono px-1.5 py-0 opacity-50"
                        >
                          {item.path}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                    <span className="text-muted-foreground text-lg flex-shrink-0">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {/* Expanded content */}
                  {isOpen && (
                    <div className="px-4 pb-4 space-y-4 border-t border-white/8 pt-4">
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>

                      <div>
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                          How to use
                        </h4>
                        <ol className="space-y-2">
                          {item.howTo.map((step, idx) => (
                            <li
                              key={step.slice(0, 30)}
                              className="flex gap-3 text-sm text-muted-foreground"
                            >
                              <span
                                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                                style={{
                                  background: "rgba(0,212,200,0.15)",
                                  color: "#00d4c8",
                                }}
                              >
                                {idx + 1}
                              </span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {item.tips && (
                        <div
                          className="rounded-lg p-3 text-xs text-muted-foreground"
                          style={{
                            background: "rgba(0,212,200,0.06)",
                            border: "1px solid rgba(0,212,200,0.15)",
                          }}
                        >
                          <span
                            style={{ color: "#00d4c8" }}
                            className="font-semibold"
                          >
                            Tip:{" "}
                          </span>
                          {item.tips}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
