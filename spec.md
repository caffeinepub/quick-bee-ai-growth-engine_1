# Specification

## Summary
**Goal:** Activate all automation toggles by default and expand the services catalog with new entries from a provided PDF.

**Planned changes:**
- In `AutomationDashboardPage.tsx`, on page load, programmatically set all automation feature flags from `automationConfig.ts` to `true` if not already enabled, and persist the state to localStorage.
- Append new services from the user-provided PDF to `seedServices.ts`, each with a unique ID, name, description, category, at least one INR-priced package, and `isActive`/`isVisible` set to `true`, without modifying existing services.

**User-visible outcome:** All automation toggles appear ON by default when visiting the Automation Dashboard, and all new services from the PDF are visible in the Services Catalog and Service Management admin list under their respective categories.
