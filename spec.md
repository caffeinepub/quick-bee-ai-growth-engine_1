# Quick Bee AI Growth Engine

## Current State
The app has: Dashboard, Lead Management, Service Management, Services Catalog, AI Smart Systems, Sales Config, Automation, Workflows, Analytics, AI Content, Webhook Logs, Checkout, Data Export, Cross-Device Sync, Social Media tools, Digital Marketing tools, AI Agent tools, and Growth Tools (Website Audit, Demo Previews, Book Consultation, Admin Dashboard). All using dark teal/gold glassmorphism theme.

## Requested Changes (Diff)

### Add
- **SmartLeadCapturePage** (`/smart-lead-capture`): A dedicated page with a prominent lead capture form capturing: name, email, phone, business name, website URL. On submit, saves to the leads localStorage array (same format as LeadsPage). Shows success confirmation. Also includes a section explaining the AI Growth services with multiple CTA buttons that open the form.
- **ClientOnboardingPage** (`/client-onboarding`): Shows a list of "Closed Won" leads from localStorage. For each, allows creating a client record with a project checklist (6 steps: Welcome Call, Requirements Gathering, Strategy Doc, Project Kickoff, Deliverables, Final Review). Shows onboarding progress per client. All stored in localStorage.
- **WebhookIntegrationPage** (`/webhook-integration`): Settings page with 4 webhook URL slots (Lead Capture, Website Audit, Demo Request, Booking). Each has: label, URL input, toggle active/inactive, test button (fires sample payload). Config saved in localStorage.
- Add all 3 new routes to App.tsx
- Add all 3 new sidebar items under "Growth Tools" group in AppSidebar.tsx

### Modify
- AppSidebar.tsx: Add 3 new items to growthToolsItems array
- App.tsx: Add 3 new route definitions and include in routeTree

### Remove
- Nothing removed

## Implementation Plan
1. Create SmartLeadCapturePage.tsx
2. Create ClientOnboardingPage.tsx
3. Create WebhookIntegrationPage.tsx
4. Update App.tsx with 3 new routes
5. Update AppSidebar.tsx with 3 new sidebar items
