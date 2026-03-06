# Quick Bee AI Growth Engine

## Current State
- Leads and Services are stored in browser localStorage (device-local only)
- Backend has Lead and Service CRUD methods but all are protected by `#user` / `#admin` auth checks
- The app bypasses authentication entirely, so backend calls for leads/services are rejected
- Data is not shared across devices — each browser has its own isolated copy
- All UI, design, and features of Version 30 are intact

## Requested Changes (Diff)

### Add
- New open (no-auth) backend endpoints for leads: `publicCreateLead`, `publicGetAllLeads`, `publicUpdateLead`, `publicDeleteLead`, `publicImportLeads`
- New open backend endpoints for services: `publicCreateService`, `publicGetAllServices`, `publicUpdateService`, `publicDeleteService`, `publicSetServiceVisibility`, `publicDuplicateService`
- A `ServiceRecord` type in backend for full service data (title, category, description, packages, addons, imageUrl, isVisible)
- Auto-polling in frontend (every 30s) to refresh leads and services from backend
- An "online indicator" badge on Lead and Service pages showing data is live from backend

### Modify
- `useGetAllLeads`, `useCreateLead`, `useUpdateLead`, `useDeleteLead`, `useImportLeads` — switch from localStorage to backend actor calls
- `useServices`, `useCreateService`, `useUpdateService`, `useDeleteService`, `useDuplicateService`, `useSetServiceVisibilityById` — switch from localStorage to backend actor calls
- `backend.d.ts` — add type declarations for all new public endpoints

### Remove
- Dependency on `leadStore` and `serviceStore` localStorage for the primary lead/service data (localStorage still used as offline fallback cache)

## Implementation Plan
1. Add new Motoko types and public functions to `main.mo` for leads (no auth check) and services (full CRUD, no auth check)
2. Regenerate / update `backend.d.ts` with new function signatures
3. Rewrite `useQueries.ts` hooks for leads and services to call the backend actor, with localStorage as an offline fallback cache
4. Add a `LiveDataBadge` component showing "Live Data" indicator
5. Add polling via `refetchInterval` on lead and service queries
6. Keep all UI files (LeadsPage.tsx, ServiceManagementPage.tsx, ServicesCatalogPage.tsx, etc.) unchanged
