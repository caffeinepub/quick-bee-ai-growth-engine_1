import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import React from "react";
import { Layout } from "./components/Layout";
import { CartProvider } from "./contexts/CartContext";
import { AIContentCreatorPage } from "./pages/AIContentCreatorPage";
import { AISmartSystemsPage } from "./pages/AISmartSystemsPage";
import { AdsTrackerPage } from "./pages/AdsTrackerPage";
import { AnalyticsEnginePage } from "./pages/AnalyticsEnginePage";
import AutomationDashboardPage from "./pages/AutomationDashboardPage";
import { AutomationWorkflowsPage } from "./pages/AutomationWorkflowsPage";
import { CampaignAutopilotPage } from "./pages/CampaignAutopilotPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { ContentCalendarPage } from "./pages/ContentCalendarPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DataExportPage } from "./pages/DataExportPage";
import { DataSyncPage } from "./pages/DataSyncPage";
import { DigitalMarketingAnalyticsPage } from "./pages/DigitalMarketingAnalyticsPage";
import { EmailCampaignsPage } from "./pages/EmailCampaignsPage";
import { ExternalToolsPage } from "./pages/ExternalToolsPage";
import { ExternalWebhooksPage } from "./pages/ExternalWebhooksPage";
import { LandingPagesPage } from "./pages/LandingPagesPage";
import LeadsPage from "./pages/LeadsPage";
import { PaymentFailurePage } from "./pages/PaymentFailurePage";
import { PaymentSuccessPage } from "./pages/PaymentSuccessPage";
import SEOManagerPage from "./pages/SEOManagerPage";
import { SalesConfigPage } from "./pages/SalesConfigPage";
import { ServiceManagementPage } from "./pages/ServiceManagementPage";
import { ServicesCatalogPage } from "./pages/ServicesCatalogPage";
import { SmartTaskAgentPage } from "./pages/SmartTaskAgentPage";
import SocialMetricsPage from "./pages/SocialMetricsPage";
import SocialSchedulerPage from "./pages/SocialSchedulerPage";
import { WebhookLogsPage } from "./pages/WebhookLogsPage";

// Root route with Layout (sidebar + outlet)
const rootRoute = createRootRoute({
  component: () => (
    <CartProvider>
      <Layout />
    </CartProvider>
  ),
});

// All child routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

const leadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/leads",
  component: LeadsPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/services",
  component: ServicesCatalogPage,
});

const serviceManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/service-management",
  component: ServiceManagementPage,
});

const aiToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-tools",
  component: AISmartSystemsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SalesConfigPage,
});

const automationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/automation",
  component: AutomationDashboardPage,
});

const workflowsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/workflows",
  component: AutomationWorkflowsPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  component: AnalyticsEnginePage,
});

const contentCreatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/content-creator",
  component: AIContentCreatorPage,
});

const webhookLogsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/webhook-logs",
  component: WebhookLogsPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-success",
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/payment-failure",
  component: PaymentFailurePage,
});

const dataExportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/data-export",
  component: DataExportPage,
});

// Social Media routes
const socialSchedulerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/social-scheduler",
  component: SocialSchedulerPage,
});

const contentCalendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/content-calendar",
  component: ContentCalendarPage,
});

const socialMetricsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/social-metrics",
  component: SocialMetricsPage,
});

const externalWebhooksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/external-webhooks",
  component: ExternalWebhooksPage,
});

const externalToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/external-tools",
  component: ExternalToolsPage,
});

// Digital Marketing routes
const seoManagerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/digital-marketing/seo",
  component: SEOManagerPage,
});

const emailCampaignsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/digital-marketing/email-campaigns",
  component: EmailCampaignsPage,
});

const adsTrackerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/digital-marketing/ads-tracker",
  component: AdsTrackerPage,
});

const landingPagesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/digital-marketing/landing-pages",
  component: LandingPagesPage,
});

const digitalMarketingAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/digital-marketing/analytics",
  component: DigitalMarketingAnalyticsPage,
});

// AI Agent routes
const smartTaskAgentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/smart-task-agent",
  component: SmartTaskAgentPage,
});

const campaignAutopilotRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/campaign-autopilot",
  component: CampaignAutopilotPage,
});

const dataSyncRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/data-sync",
  component: DataSyncPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  leadsRoute,
  servicesRoute,
  serviceManagementRoute,
  aiToolsRoute,
  settingsRoute,
  automationRoute,
  workflowsRoute,
  analyticsRoute,
  contentCreatorRoute,
  webhookLogsRoute,
  checkoutRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  dataExportRoute,
  socialSchedulerRoute,
  contentCalendarRoute,
  socialMetricsRoute,
  externalWebhooksRoute,
  externalToolsRoute,
  seoManagerRoute,
  emailCampaignsRoute,
  adsTrackerRoute,
  landingPagesRoute,
  digitalMarketingAnalyticsRoute,
  smartTaskAgentRoute,
  campaignAutopilotRoute,
  dataSyncRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
