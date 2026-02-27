import React from 'react';
import {
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
  Outlet,
} from '@tanstack/react-router';
import { CartProvider } from './contexts/CartContext';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { LeadsPage } from './pages/LeadsPage';
import { ServicesCatalogPage } from './pages/ServicesCatalogPage';
import { ServiceManagementPage } from './pages/ServiceManagementPage';
import { AISmartSystemsPage } from './pages/AISmartSystemsPage';
import { SalesConfigPage } from './pages/SalesConfigPage';
import { AutomationDashboardPage } from './pages/AutomationDashboardPage';
import { AutomationWorkflowsPage } from './pages/AutomationWorkflowsPage';
import { AnalyticsEnginePage } from './pages/AnalyticsEnginePage';
import { AIContentCreatorPage } from './pages/AIContentCreatorPage';
import { WebhookLogsPage } from './pages/WebhookLogsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentSuccessPage } from './pages/PaymentSuccessPage';
import { PaymentFailurePage } from './pages/PaymentFailurePage';

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
  path: '/',
  component: DashboardPage,
});

const leadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leads',
  component: LeadsPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: ServicesCatalogPage,
});

const serviceManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/service-management',
  component: ServiceManagementPage,
});

const aiToolsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ai-tools',
  component: AISmartSystemsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SalesConfigPage,
});

const automationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/automation',
  component: AutomationDashboardPage,
});

const workflowsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/workflows',
  component: AutomationWorkflowsPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: AnalyticsEnginePage,
});

const contentCreatorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/content-creator',
  component: AIContentCreatorPage,
});

const webhookLogsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/webhook-logs',
  component: WebhookLogsPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
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
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
