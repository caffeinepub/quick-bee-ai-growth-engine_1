# Specification

## Summary
**Goal:** Add two new AI Agent pages (Smart Task Agent and Campaign Autopilot) to the Quick Bee AI Growth Engine, along with a new sidebar navigation group to access them.

**Planned changes:**
- Add a new "AI Agent" collapsible group to the AppSidebar (below the Digital Marketing section) with links to Smart Task Agent and Campaign Autopilot, using a bot/robot icon matching the dark teal design system
- Create a `/smart-task-agent` page with:
  - A goal input form that breaks down the goal into actionable sub-tasks shown as a checklist
  - A priority queue panel where tasks display priority (High/Medium/Low) and due date, and can be marked complete or reordered
  - A "Next Step" suggestion banner that appears when a task is marked complete
  - All task data persisted to localStorage
- Create a `/campaign-autopilot` page with:
  - A content auto-scheduler section for defining posting windows (day + time) per platform, displaying scheduled posts sorted by those windows
  - A campaign health monitor panel showing color-coded status badges (Healthy / At Risk / Underperforming) based on user-defined CTR and conversion thresholds
  - An on-demand performance summary card generator with a configurable daily/weekly schedule
  - All configuration persisted to localStorage

**User-visible outcome:** Users can navigate to two new AI Agent pages from the sidebar — one for breaking down goals into prioritized tasks with next-step suggestions, and one for managing content schedules, monitoring campaign health, and generating performance summaries.
