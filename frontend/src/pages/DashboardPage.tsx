import React from 'react';
import { Link } from '@tanstack/react-router';
import {
  Users, Briefcase, Zap, BarChart3, Bot, Settings,
  GitBranch, PenTool, Webhook, ShoppingCart, Settings2, TrendingUp,
  CheckCircle, Clock, XCircle, AlertCircle
} from 'lucide-react';
import { useLeads } from '../hooks/useQueries';
import { useServices } from '../hooks/useQueries';
import { getLogs } from '../utils/webhookLogger';
import { getAutomationConfig } from '../utils/automationConfig';

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed Won', 'Closed Lost'];

const quickActions = [
  { path: '/leads', label: 'Lead Management', icon: Users, desc: 'Manage your CRM pipeline' },
  { path: '/services', label: 'Services Catalog', icon: Briefcase, desc: 'Browse all services' },
  { path: '/service-management', label: 'Service Management', icon: Settings2, desc: 'Create & manage services' },
  { path: '/ai-tools', label: 'AI Smart Systems', icon: Bot, desc: '6 AI-powered tools' },
  { path: '/settings', label: 'Sales Config', icon: Settings, desc: 'Configure credentials' },
  { path: '/automation', label: 'Automation', icon: Zap, desc: 'Toggle automations' },
  { path: '/workflows', label: 'Workflows', icon: GitBranch, desc: 'Run automation workflows' },
  { path: '/analytics', label: 'Analytics Engine', icon: BarChart3, desc: 'GA4-style reports' },
  { path: '/content-creator', label: 'AI Content', icon: PenTool, desc: 'Generate content with AI' },
  { path: '/webhook-logs', label: 'Webhook Logs', icon: Webhook, desc: 'Monitor API calls' },
  { path: '/checkout', label: 'Checkout', icon: ShoppingCart, desc: 'Cart & payments' },
];

export function DashboardPage() {
  const { data: leads = [] } = useLeads();
  const { data: services = [] } = useServices();
  const logs = getLogs().slice(0, 5);
  const automationConfig = getAutomationConfig();

  const statusCounts = LEAD_STATUSES.reduce((acc, s) => {
    acc[s] = leads.filter(l => l.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const automationItems = [
    { key: 'whatsappAutoReply', label: 'WhatsApp Auto-Reply' },
    { key: 'proposalAutoSend', label: 'Proposal Auto-Send' },
    { key: 'leadFollowUp', label: 'Lead Follow-Up' },
    { key: 'paymentConfirmation', label: 'Payment Confirmation' },
    { key: 'projectOnboarding', label: 'Project Onboarding' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ minHeight: '180px' }}
      >
        <img
          src="/assets/generated/hero-bg.dim_1920x400.png"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(8,12,12,0.85) 0%, rgba(0,180,166,0.15) 100%)' }} />
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-3 mb-3">
            <img src="/assets/generated/quickbee-logo.dim_256x256.png" alt="QB" className="w-12 h-12 rounded-xl" />
            <div>
              <h1 className="text-3xl font-display font-bold teal-gradient-text">Quick Bee AI Growth Engine</h1>
              <p style={{ color: 'rgba(232,245,244,0.6)' }} className="text-sm">Your all-in-one AI agency platform dashboard</p>
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <div className="glass-card rounded-lg px-4 py-2 text-center">
              <div className="text-2xl font-bold teal-gradient-text">{leads.length}</div>
              <div className="text-xs" style={{ color: 'rgba(232,245,244,0.5)' }}>Total Leads</div>
            </div>
            <div className="glass-card rounded-lg px-4 py-2 text-center">
              <div className="text-2xl font-bold teal-gradient-text">{services.length}</div>
              <div className="text-xs" style={{ color: 'rgba(232,245,244,0.5)' }}>Services</div>
            </div>
            <div className="glass-card rounded-lg px-4 py-2 text-center">
              <div className="text-2xl font-bold teal-gradient-text">
                {Object.values(automationConfig).filter(Boolean).length}
              </div>
              <div className="text-xs" style={{ color: 'rgba(232,245,244,0.5)' }}>Active Automations</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {LEAD_STATUSES.map(status => {
          const icons: Record<string, React.ReactNode> = {
            'New': <AlertCircle size={14} />,
            'Contacted': <Clock size={14} />,
            'Qualified': <TrendingUp size={14} />,
            'Proposal Sent': <Briefcase size={14} />,
            'Closed Won': <CheckCircle size={14} />,
            'Closed Lost': <XCircle size={14} />,
          };
          const colors: Record<string, string> = {
            'New': '#60a5fa', 'Contacted': '#c084fc', 'Qualified': '#00d4c8',
            'Proposal Sent': '#fbbf24', 'Closed Won': '#4ade80', 'Closed Lost': '#f87171',
          };
          return (
            <div key={status} className="glass-card rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1" style={{ color: colors[status] }}>
                {icons[status]}
                <span className="text-xs font-medium">{status}</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: colors[status] }}>{statusCounts[status] || 0}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Webhook Logs */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Webhook size={18} style={{ color: '#00d4c8' }} />
            <h3 className="font-display font-semibold text-white">Recent Webhook Activity</h3>
          </div>
          {logs.length === 0 ? (
            <p className="text-sm" style={{ color: 'rgba(232,245,244,0.4)' }}>No webhook activity yet.</p>
          ) : (
            <div className="space-y-2">
              {logs.map(log => (
                <div key={log.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${log.success ? 'bg-green-400' : 'bg-red-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate">{log.toolName}</div>
                    <div className="text-xs truncate" style={{ color: 'rgba(232,245,244,0.4)' }}>{log.payloadSummary}</div>
                  </div>
                  <div className="text-xs flex-shrink-0" style={{ color: 'rgba(232,245,244,0.4)' }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </div>
                  <div className={`text-xs font-mono flex-shrink-0 ${log.success ? 'text-green-400' : 'text-red-400'}`}>
                    {log.statusCode}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Automation Status */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} style={{ color: '#00d4c8' }} />
            <h3 className="font-display font-semibold text-white">Automation Status</h3>
          </div>
          <div className="space-y-3">
            {automationItems.map(({ key, label }) => {
              const isOn = automationConfig[key as keyof typeof automationConfig];
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'rgba(232,245,244,0.7)' }}>{label}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isOn ? 'bg-teal/15 text-teal' : 'bg-white/5 text-white/30'}`}
                    style={isOn ? { color: '#00d4c8', background: 'rgba(0,180,166,0.15)' } : {}}>
                    {isOn ? 'ON' : 'OFF'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display font-bold text-xl text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {quickActions.map(({ path, label, icon: Icon, desc }) => (
            <Link
              key={path}
              to={path}
              className="glass-card-hover rounded-xl p-4 text-center group cursor-pointer block"
            >
              <div className="w-10 h-10 rounded-xl teal-gradient flex items-center justify-center mx-auto mb-3 group-hover:teal-glow transition-all">
                <Icon size={20} className="text-black" />
              </div>
              <div className="text-sm font-semibold text-white mb-1">{label}</div>
              <div className="text-xs" style={{ color: 'rgba(232,245,244,0.4)' }}>{desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
