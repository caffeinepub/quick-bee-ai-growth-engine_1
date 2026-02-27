# Specification

## Summary
**Goal:** Build a full-stack AI agency platform dashboard called "Quick Bee AI Growth Engine" with a Motoko backend for lead and service data, and a feature-rich React/TypeScript frontend with a premium dark teal-green glassmorphism theme.

**Planned changes:**

### Backend (Motoko — single main actor)
- Lead Management CRUD: `createLead`, `getLeads`, `updateLead`, `deleteLead` with stable storage; fields: id, name, email, phone, serviceInterest, status (6 values), notes
- Agency Services CRUD: `createService`, `getServices`, `updateService`, `deleteService`, `reorderServices` with stable storage; fields: id, name, category, description, packages (tiers + price + features), addons, maintenancePlan, isVisible, sortOrder

### Frontend
- **Theme:** Dark background (#0a0a0a), teal-green gradient (#00b4a6–#00d4c8) accents, glassmorphism cards (backdrop-blur, semi-transparent borders), bold Inter/Space Grotesk typography — applied globally; no login/auth
- **Routing (TanStack Router):** 14 routes — `/`, `/leads`, `/services`, `/service-management`, `/ai-tools`, `/settings`, `/automation`, `/workflows`, `/analytics`, `/content-creator`, `/webhook-logs`, `/checkout`, `/payment-success`, `/payment-failure`; wrapped with React Query provider
- **Persistent sidebar:** Brand logo/name, links to all 12 sections, active route highlight, collapses to icon-only on mobile
- **Dashboard (`/`):** KPI cards (lead count + status breakdown, services count), last 5 webhook log entries, automation ON/OFF summary, quick-action section links — all glassmorphism styled
- **Lead Management (`/leads`):** Table view + Kanban pipeline view (toggle), add/edit/delete leads via modal, CSV export, PDF export, status drag-and-drop in Kanban — syncs to backend
- **Services Catalog (`/services`):** 7 category filter tabs, 30 pre-seeded service cards with INR tiered pricing (Student/Business/Premium/Enterprise), preview modal with packages/add-ons/price calculator, 3 Master Plan cards (Spark/Surge/Titan), Buy Now → cart, maintenance plan pricing on applicable cards
- **Service Management (`/service-management`):** Drag-and-drop reorderable services list, edit modal (packages/add-ons/maintenance), duplicate, delete with confirmation, visibility toggle, preview modal, Create New Service — persists to backend
- **AI Smart Systems (`/ai-tools`):** 6 tool panels (Service Recommender, Proposal Generator, Pricing Strategy, Closing Scripts, Follow-Up Messages, Lead Qualification), each with input form, Generate button → OpenAI-compatible API call, formatted output, export to .txt/.pdf; warning if API not configured; logs each call
- **Sales Configuration (`/settings`):** 9 credential fields (API Endpoint, API Key, WhatsApp Token, Razorpay Key ID, Razorpay Secret, Email API Key, CRM Webhook URL, Automation Webhook URL, Calendly URL) with ON/OFF toggles, status badges, Test Connection for webhook URLs, save/load from localStorage
- **Automation Dashboard (`/automation`):** 5 automation toggles (WhatsApp Auto-Reply, Proposal Auto-Send, Lead Follow-Up Sequences, Payment Confirmation, Project Onboarding) persisted to `quickbee_automation_config` in localStorage; fires POST to Automation Webhook URL with Authorization header when ON; logs each call
- **Automation Workflows (`/workflows`):** 5 workflow cards (New Lead Submission, Meeting Scheduling, Payment Processing, Analytics Engine, AI Content Creation) with status badge, manual Run button → POST to Automation Webhook URL, last execution result as formatted JSON; logs each run
- **Analytics Engine (`/analytics`):** Date range picker → POST to Automation Webhook URL; simulated GA4-style report (4 KPI cards, sessions line chart, traffic sources bar chart, top pages table); simulated data with notice if webhook not configured
- **AI Content Creator (`/content-creator`):** Keyword input → OpenAI-compatible API call generating SEO blog post, 5 social captions, LinkedIn post, Instagram carousel outline; per-section copy buttons, full export; logs call
- **Webhook Logs (`/webhook-logs`):** Table of all outgoing calls (timestamp, tool name, URL, payload summary, HTTP status, success/failure color); filter by tool name and status; Clear Logs button; shared utility writes logs to `quickbee_webhook_logs` in localStorage
- **Checkout (`/checkout`):** Cart (localStorage/React context) with INR pricing and total, Razorpay checkout using saved Key ID; on success → `/payment-success` with invoice ref `QBA-{timestamp}` + fires Payment Processing workflow POST; on failure → `/payment-failure` with retry option

**User-visible outcome:** Users land directly on a premium dark agency dashboard, can manage leads in a CRM pipeline, browse and purchase 30+ services with INR pricing via Razorpay, run 6 AI tools for sales content, configure all credentials, toggle automations, manually run workflows, view analytics reports, generate multi-format AI content, and inspect a full webhook activity log — all within a cohesive teal-green glassmorphism interface.
