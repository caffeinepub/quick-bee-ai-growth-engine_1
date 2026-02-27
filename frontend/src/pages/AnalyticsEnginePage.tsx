import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Target, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateMockAnalytics, type AnalyticsData } from '../utils/mockAnalyticsData';
import { getSalesConfig } from '../utils/salesConfig';
import { logWebhookCall } from '../utils/webhookLogger';

export function AnalyticsEnginePage() {
  const [startDate, setStartDate] = useState('2026-02-01');
  const [endDate, setEndDate] = useState('2026-02-27');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [simulated, setSimulated] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const config = getSalesConfig();
    const url = config.automationWebhookUrl;
    const payload = { workflow: 'analytics-engine', event: 'analytics.request', dateRange: { startDate, endDate } };

    if (url && config.automationWebhookUrlEnabled) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.apiKey}` },
          body: JSON.stringify(payload),
        });
        logWebhookCall('Analytics Engine', url, payload, response.status, response.ok);
      } catch {
        logWebhookCall('Analytics Engine', url, payload, 0, false);
      }
    }

    const mockData = generateMockAnalytics(startDate, endDate);
    setData(mockData);
    setSimulated(!url || !config.automationWebhookUrlEnabled);
    setLoading(false);
  };

  const inputStyle = { background: 'rgba(0,180,166,0.05)', borderColor: 'rgba(0,180,166,0.2)', color: '#e8f5f4' };

  const kpis = data ? [
    { label: 'Total Sessions', value: data.sessions.toLocaleString(), icon: TrendingUp, color: '#00d4c8' },
    { label: 'New Users', value: data.newUsers.toLocaleString(), icon: Users, color: '#60a5fa' },
    { label: 'Revenue (INR)', value: `₹${data.revenue.toLocaleString('en-IN')}`, icon: DollarSign, color: '#4ade80' },
    { label: 'Conversion Rate', value: `${data.conversionRate}%`, icon: Target, color: '#fbbf24' },
  ] : [];

  const chartTooltipStyle = { background: '#0d1414', border: '1px solid rgba(0,180,166,0.2)', color: '#e8f5f4' };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <img src="/assets/generated/icon-analytics.dim_128x128.png" alt="" className="w-10 h-10 rounded-xl" />
          <div>
            <h1 className="page-title">Analytics Engine</h1>
            <p className="page-subtitle">GA4-style analytics reports and growth insights</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold text-white mb-4">Date Range</h3>
        <div className="flex items-end gap-4 flex-wrap">
          <div>
            <Label className="text-white/60 text-xs mb-1 block">Start Date</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} className="w-44" />
          </div>
          <div>
            <Label className="text-white/60 text-xs mb-1 block">End Date</Label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} className="w-44" />
          </div>
          <Button onClick={handleSubmit} disabled={loading} className="btn-teal">
            {loading ? <><Loader2 size={14} className="mr-2 animate-spin" /> Generating...</> : 'Generate Report'}
          </Button>
        </div>
      </div>

      {simulated && data && (
        <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <AlertCircle size={14} style={{ color: '#fbbf24' }} />
          <span className="text-xs" style={{ color: '#fbbf24' }}>Showing simulated data. Configure Automation Webhook URL for live data.</span>
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="glass-card rounded-xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={18} style={{ color }} />
                  <span className="text-xs" style={{ color: 'rgba(232,245,244,0.5)' }}>{label}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color }}>{value}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4">Sessions Over Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.sessionsTrend.slice(-14)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,180,166,0.1)" />
                  <XAxis dataKey="date" tick={{ fill: 'rgba(232,245,244,0.4)', fontSize: 10 }} tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fill: 'rgba(232,245,244,0.4)', fontSize: 10 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Line type="monotone" dataKey="sessions" stroke="#00d4c8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="users" stroke="#60a5fa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card rounded-xl p-5">
              <h3 className="font-semibold text-white mb-4">Traffic Sources</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data.trafficSources}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,180,166,0.1)" />
                  <XAxis dataKey="source" tick={{ fill: 'rgba(232,245,244,0.4)', fontSize: 9 }} />
                  <YAxis tick={{ fill: 'rgba(232,245,244,0.4)', fontSize: 10 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="sessions" fill="#00b4a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(0,180,166,0.15)' }}>
              <h3 className="font-semibold text-white">Top Performing Pages</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'rgba(0,180,166,0.05)' }}>
                  {['Page Path', 'Views', 'Avg. Duration'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#00d4c8' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.topPages.map(page => (
                  <tr key={page.path} style={{ borderBottom: '1px solid rgba(0,180,166,0.08)' }} className="hover:bg-teal/5 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: '#00d4c8' }}>{page.path}</td>
                    <td className="px-5 py-3 text-white">{page.views.toLocaleString()}</td>
                    <td className="px-5 py-3" style={{ color: 'rgba(232,245,244,0.6)' }}>{page.avgDuration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
