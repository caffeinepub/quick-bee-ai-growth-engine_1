# Specification

## Summary
**Goal:** Add a Social Media Management Suite to the Quick Bee AI Growth Engine, including a post scheduler, content calendar, metrics dashboard, external webhook receiver, and external tools reference page.

**Planned changes:**
- Add backend data model and CRUD operations for social media post ideas (fields: id, title, caption, platform, status, scheduledDate, tags, notes, timestamps)
- Add backend data model and CRUD operations for manually logged social media metrics (followers, impressions, reach, engagements, clicks, etc.)
- Add backend external webhook receiver functions (receiveExternalWebhook, getExternalWebhookLogs, clearExternalWebhookLogs) stored in a separate stable map
- Create `/social-scheduler` page with list/grid toggle, platform/status filters, and modal form for creating/editing/deleting post ideas
- Create `/content-calendar` page with monthly calendar grid showing scheduled posts as colored platform badges, month navigation, and click-to-edit functionality
- Create `/social-metrics` page with KPI summary cards, Recharts bar/line charts, a log entry modal form, and a filterable table of logged metric entries
- Create `/external-webhooks` page showing a table of received webhook payloads with expand toggle, refresh/clear buttons, and the canister endpoint URL
- Create `/external-tools` page with cards for Zapier, Make, n8n, Buffer, Hootsuite, and Later, plus a how-to-connect section
- Add a "Social Media" group to the AppSidebar with links to all five new pages and register all new routes in App.tsx

**User-visible outcome:** Users can manage social media post ideas on a scheduler and calendar, manually log and visualize platform metrics, view incoming external webhook payloads, and reference recommended external tools for automation integrations — all within the existing app navigation.
